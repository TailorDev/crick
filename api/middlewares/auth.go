package middlewares

import (
	"context"
	"database/sql"
	"encoding/json"
	"io/ioutil"
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
	selectUserByID                   = `SELECT * FROM users WHERE auth0_id=$1;`
	selectUserByToken                = `SELECT * FROM users WHERE watson_token=$1;`
	DetailInvalidAuthorizationHeader = "Invalid or missing Authorization header"
	DetailUserNotFound               = "User not found"
	DetailMalformedToken             = "Malformed JWT token (claims)"
	DetailUserCreationFailed         = "User creation failed"
	DetailUserSelectionFailed        = "User selection failed"
	DetailUserProfileRetrialFailed   = "User profile retrieval failed"
)

// AuthWithAuth0 returns the Auth0 authentication middleware.
func AuthWithAuth0(h httprouter.Handle, db *sqlx.DB, logger *zap.Logger) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		c := config.Auth0()
		configuration := auth0.NewConfiguration(
			auth0.NewJWKClient(auth0.JWKClientOptions{URI: c.JwksURI}),
			c.Audience,
			c.Domain,
			jose.RS256,
		)
		validator := auth0.NewValidator(configuration)

		token, err := validator.ValidateRequest(r)
		if err != nil {
			logger.Warn("authentication failed", zap.Error(err))
			SendError(w, http.StatusUnauthorized, DetailUserNotFound)
			return
		}

		// user's auth0_id is stored in a JWT claim (`sub`)
		claims := map[string]interface{}{}
		err = validator.Claims(r, token, &claims)
		if err != nil {
			logger.Error("cannot retrieve JWT claims", zap.Error(err))
			SendError(w, http.StatusBadRequest, DetailMalformedToken)
			return
		}

		u := &models.User{}

		id := claims["sub"].(string)
		if err := db.Get(u, selectUserByID, id); err != nil {
			if err == sql.ErrNoRows {
				logger.Info("create new authenticated user", zap.String("auth0_id", id))

				profile, err := getUserProfile(c.Domain, r.Header.Get("Authorization"))
				if err != nil {
					logger.Error("cannot retrieve user profile", zap.Error(err))
					SendError(w, http.StatusInternalServerError, DetailUserProfileRetrialFailed)
					return
				}

				u, err = models.CreateNewUser(db, profile["sub"], profile["nickname"])
				if err != nil {
					logger.Error("cannot create new user", zap.Error(err))
					SendError(w, http.StatusInternalServerError, DetailUserCreationFailed)
					return
				}
			} else {
				logger.Error("could not select user by ID", zap.Error(err), zap.String("auth0_id", id))
				SendError(w, http.StatusInternalServerError, DetailUserSelectionFailed)
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
			SendError(w, http.StatusBadRequest, DetailInvalidAuthorizationHeader)
			return
		}

		u := &models.User{}
		if err := db.Get(u, selectUserByToken, token); err != nil {
			SendError(w, http.StatusUnauthorized, DetailUserNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), contextCurrentUser, u)
		h(w, r.WithContext(ctx), ps)
	}
}

func getUserProfile(domain, authHeader string) (map[string]string, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", domain+"userinfo", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", authHeader)

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	raw, err := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		return nil, err
	}

	var profile map[string]string
	if err = json.Unmarshal(raw, &profile); err != nil {
		return nil, err
	}

	return profile, nil
}
