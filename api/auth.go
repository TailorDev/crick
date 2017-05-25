package main

import (
	"net/http"

	"go.uber.org/zap"

	"github.com/TailorDev/crick/api/config"
	"github.com/auth0-community/go-auth0"
	"github.com/julienschmidt/httprouter"
	"gopkg.in/square/go-jose.v2"
)

func auth(h httprouter.Handle, logger *zap.Logger) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		c := config.Auth0()
		configuration := auth0.NewConfiguration(
			auth0.NewKeyProvider([]byte(c.Secret)),
			c.Audience,
			c.Issuer,
			jose.RS256,
		)

		_, err := auth0.NewValidator(configuration).ValidateRequest(r)
		if err != nil {
			logger.Warn("authentication failed", zap.Error(err))
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		} else {
			h(w, r, ps)
		}
	}
}
