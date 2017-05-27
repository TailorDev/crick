package middlewares

import (
	"context"
	"net/http"

	"go.uber.org/zap"

	"github.com/TailorDev/crick/api/config"
	"github.com/auth0-community/go-auth0"
	"github.com/julienschmidt/httprouter"
	"gopkg.in/square/go-jose.v2"
)

type contextKey string

func (c contextKey) String() string {
	return "io.crick.api.middlewares" + string(c)
}

var (
	contextUserID = contextKey("user_id")
)

// GetUserID returns the Auth0 user ID from the Context.
func GetUserID(ctx context.Context) string {
	return ctx.Value(contextUserID).(string)
}

// Auth returns the Auth0 authentication middleware.
func Auth(h httprouter.Handle, logger *zap.Logger) httprouter.Handle {
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

			ctx := context.WithValue(r.Context(), contextUserID, claims["sub"])
			h(w, r.WithContext(ctx), ps)
		}
	}
}
