// Package middleware contains the HTTP middleware.
package middleware

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/TailorDev/crick/api/models"
)

type contextKey string

func (c contextKey) String() string {
	return "io.crick.api.middleware." + string(c)
}

var (
	// ContextCurrentUser is the context key for the models.User instance. It
	// should not be exposed, but it is used in the test suite...
	ContextCurrentUser = contextKey("current_user")
)

// GetCurrentUser returns the current logged user from the Context.
//
// This function is usually called by the different handlers enhanced with one
// of the authentication middleware. NOTE: handlers expect a valid User to be
// returned.
func GetCurrentUser(ctx context.Context) *models.User {
	return ctx.Value(ContextCurrentUser).(*models.User)
}

// SendError returns a HTTP error in JSON.
func SendError(w http.ResponseWriter, statusCode int, detail string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{
		"title":  http.StatusText(statusCode),
		"detail": detail,
	})
}
