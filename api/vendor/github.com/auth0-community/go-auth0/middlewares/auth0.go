package middlewares

import (
	"encoding/json"
	"net/http"
	"net/url"

	"github.com/yageek/auth0"

	"gopkg.in/square/go-jose.v2"
)

type Auth0 auth0.JWTValidator

type JWKProvider struct {
	URL url.URL
}

func (j *JWKProvider) GetConfiguration() (auth0.Configuration, error) {
	resp, err := http.DefaultClient.Get(j.URL.String())
	if err != nil {
		return auth0.Configuration{}, err
	}
	defer resp.Body.Close()

	var key = jose.JSONWebKey{}
	err = json.NewDecoder(resp.Body).Decode(&key)

	if err != nil {
		return auth0.Configuration{}, err
	}
	return auth0.Configuration{}, err
}

/*
// NewAuth0GroupsForClient returns a new Auth0 authenticator
func NewAuth0(provider auth0.SecretProvider, audience, issuer string, method jose.SignatureAlgorithm) *Auth0 {
	configuration := auth0.NewConfiguration(provider, audience, issuer, method)
	return &auth0.NewValidator(configuration)
}

func(a *Auth0) AuthorizedForGroups(wantedGroups ...string) bool {
	metadata, okMetadata := jwt.Claims().Get("app_metadata").(map[string]interface{})
	authorization, okAuthorization := metadata["authorization"].(map[string]interface{})
	groups, hasGroups := authorization["groups"].([]interface{})
	return okMetadata && okAuthorization && hasGroups && shouldAccess(wantedGroups, groups)
}

func shouldAccess(wantedGroups []string, groups []interface{}) bool {

	if len(groups) < 1 {
		return true
	}

	for _, wantedScope := range wantedGroups {

		scopeFound := false

		for _, iScope := range groups {
			scope, ok := iScope.(string)

			if !ok {
				continue
			}
			if scope == wantedScope {
				scopeFound = true
				break
			}
		}
		if !scopeFound {
			return false
		}
	}
	return true
}
*/
