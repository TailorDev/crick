// Package config owns common functions to get the application's configuration.
package config

import "os"

// Port returns the PORT value from environment or it defaults to `3000`.
func Port() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	return port
}

// DSN returns the HOST value from environment.
func DSN() string {
	return os.Getenv("CRICK_DSN")
}
