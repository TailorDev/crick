// Package middlewares contains the HTTP middlewares.
package middlewares

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/TailorDev/crick/api/models"
)

type contextKey string

func (c contextKey) String() string {
	return "io.crick.api.middlewares." + string(c)
}

var (
	ContextCurrentUser = contextKey("current_user")
)

// GetCurrentUser returns the current logged user from the Context.
//
// This function is usually called by the different handlers enhanced with one
// of the authentication middlewares. NOTE: handlers expect a valid User to be
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
