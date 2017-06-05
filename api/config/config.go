// Package config owns common functions to get the application's configuration.
package config

import (
	"os"
	"strings"
)

// Auth0Config represents the Auth0 configuration.
type Auth0Config struct {
	Domain   string
	JwksURI  string
	Audience []string
}

// Port returns the PORT value from environment.
func Port() string {
	return os.Getenv("PORT")
}

// DSN returns the CRICK_DSN value from environment.
func DSN() string {
	return os.Getenv("CRICK_DSN")
}

// Auth0 returns the Auth0 configuration, based on the AUTH0_* environment
// variables:
//   * AUTH0_DOMAIN is the Auth0 domain
//   * AUTH0_AUDIENCE is expected to be a comma-separated string value, containing audiences
//   * AUTH0_JWKS_URI is the Auth0 JWKS URI
func Auth0() Auth0Config {
	return Auth0Config{
		Domain:   os.Getenv("AUTH0_DOMAIN"),
		Audience: strings.Split(os.Getenv("AUTH0_AUDIENCE"), ","),
		JwksURI:  os.Getenv("AUTH0_JWKS_URI"),
	}
}

// CorsAllowedOrigins returns a list of allowed origins to configure the CORS
// middleware.
func CorsAllowedOrigins() []string {
	var origins []string

	val := os.Getenv("CORS_ALLOWED_ORIGINS")
	if val != "" {
		origins = strings.Split(val, ",")
	}

	return origins
}
