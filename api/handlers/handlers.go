// Package handlers contains the application logic (controllers).
//
// All handlers expect JSON content (if any) and return JSON content, along
// with proper status codes. More information at:
// http://docs.crickapi.apiary.io/.
package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/TailorDev/crick/api/models"
	"go.uber.org/zap"
)

var (
	// The error message used when the request parsing has failed.
	DetailInvalidRequest = "Invalid request"
	// The error message used when it is not possible to parse the JSON content.
	DetailMalformedJSON = "Malformed JSON"
)

// Handler is the structure that contains the different HTTP handlers.
type Handler struct {
	repository models.Repository
	logger     *zap.Logger
}

// New creates the main handler.
func New(repository models.Repository, logger *zap.Logger) Handler {
	return Handler{
		repository: repository,
		logger:     logger,
	}
}

// SendError returns a HTTP error in JSON.
func (h Handler) SendError(w http.ResponseWriter, statusCode int, detail string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{
		"title":  http.StatusText(statusCode),
		"detail": detail,
	})
}
