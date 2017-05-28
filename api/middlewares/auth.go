package middlewares

import (
	"context"
	"database/sql"
	"net/http"
	"strings"

	"go.uber.org/zap"

	"github.com/TailorDev/crick/api/config"
	"github.com/TailorDev/crick/api/models"
	"github.com/auth0-community/go-auth0"
	"github.com/jmoiron/sqlx"
	"github.com/julienschmidt/httprouter"
	"gopkg.in/square/go-jose.v2"
)

var (
	selectUserByID    = `SELECT * FROM users WHERE auth0_id=$1;`
	selectUserByToken = `SELECT * FROM users WHERE watson_token=$1;`
)

// AuthWithAuth0 returns the Auth0 authentication middleware.
func AuthWithAuth0(h httprouter.Handle, db *sqlx.DB, logger *zap.Logger) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		c := config.Auth0()
		configuration := auth0.NewConfiguration(
			auth0.NewKeyProvider([]byte(c.Secret)),
			c.Audience,
			c.Issuer,
			jose.RS256,
		)
		validator := auth0.NewValidator(configuration)

		token, err := validator.ValidateRequest(r)
		if err != nil {
			logger.Warn("authentication failed", zap.Error(err))
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		// user's auth0_id is stored in a JWT claim (`sub`)
		claims := map[string]interface{}{}
		err = validator.Claims(r, token, &claims)
		if err != nil {
			logger.Error("cannot retrieve JWT claims", zap.Error(err))
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		}

		id := claims["sub"].(string)
		u := &models.User{}
		if err := db.Get(u, selectUserByID, id); err != nil {
			if err == sql.ErrNoRows {
				logger.Info("create new authenticated user", zap.String("auth0_id", id))

				u, err = models.CreateNewUser(db, id)
				if err != nil {
					logger.Error("cannot create new user", zap.Error(err))
					http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
					return
				}
			} else {
				logger.Error("could not select user by ID", zap.Error(err), zap.String("auth0_id", id))
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}
		}

		ctx := context.WithValue(r.Context(), contextCurrentUser, u)
		h(w, r.WithContext(ctx), ps)
	}
}

// AuthWithToken returns the token-based middleware, which adds an
// authenticated user to the request context if everything is ok.
func AuthWithToken(h httprouter.Handle, db *sqlx.DB) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		auth := r.Header.Get("Authorization")
		token := strings.TrimPrefix(auth, "Token ")
		if token == "" {
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		u := &models.User{}
		if err := db.Get(u, selectUserByToken, token); err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), contextCurrentUser, u)
		h(w, r.WithContext(ctx), ps)
	}
}
