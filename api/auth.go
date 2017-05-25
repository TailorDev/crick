package main

import (
	"fmt"
	"net/http"

	"github.com/TailorDev/crick/api/config"
	"github.com/auth0-community/go-auth0"
	"github.com/julienschmidt/httprouter"
	"gopkg.in/square/go-jose.v2"
)

func authMiddleware(h httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		c := config.Auth0()
		client := auth0.NewJWKClient(auth0.JWKClientOptions{URI: c.JwksURI})
		configuration := auth0.NewConfiguration(client, c.Audience, c.Issuer, jose.RS256)
		validator := auth0.NewValidator(configuration)

		token, err := validator.ValidateRequest(r)
		if err != nil {
			fmt.Println(err)
			fmt.Println(token)
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		} else {
			h(w, r, ps)
		}
	}
}
