package middlewares

import (
	"context"
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

type contextKey string

func (c contextKey) String() string {
	return "io.crick.api.middlewares" + string(c)
}

var (
	contextUserID      = contextKey("user_id")
	contextCurrentUser = contextKey("current_user")
	selectUserByID     = `SELECT * FROM users WHERE auth0_id=$1;`
	selectUserByToken  = `SELECT * FROM users WHERE watson_token=$1;`
)

// GetUserID returns the user ID from the Context.
func GetUserID(ctx context.Context) string {
	return ctx.Value(contextUserID).(string)
}

// GetCurrentUser returns the current logged user from the Context.
func GetCurrentUser(ctx context.Context) *models.User {
	return ctx.Value(contextCurrentUser).(*models.User)
}

// AuthWithAuth0 returns the Auth0 authentication middleware.
func AuthWithAuth0(h httprouter.Handle, db *sqlx.DB, logger *zap.Logger, withUser bool) httprouter.Handle {
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
		} else {
			claims := map[string]interface{}{}
			err = validator.Claims(r, token, &claims)
			if err != nil {
				logger.Error("retrieving claims failed", zap.Error(err))
				http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			}

			if withUser {
				u := &models.User{}
				if err := db.Get(u, selectUserByID, claims["sub"]); err != nil {
					logger.Error("select user by id in WithUser middleware", zap.Error(err))

					http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
					return
				}

				ctx := context.WithValue(r.Context(), contextCurrentUser, u)
				h(w, r.WithContext(ctx), ps)
			} else {
				ctx := context.WithValue(r.Context(), contextUserID, claims["sub"])
				h(w, r.WithContext(ctx), ps)
			}
		}
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
