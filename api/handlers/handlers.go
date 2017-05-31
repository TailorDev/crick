// Package handlers contains the application logic (controllers).
//
// All handlers expect JSON content (if any) and return JSON content, along
// with proper status codes. More information at:
// http://docs.crickapi.apiary.io/.
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/TailorDev/crick/api/models"
	"go.uber.org/zap"
)

var (
	// DefaultContentType is the default content type for handler responses.
	DefaultContentType = "application/json"

	// DetailInvalidRequest is the error message used when the request parsing has failed.
	DetailInvalidRequest = "Invalid request"
	// DetailMalformedJSON is the error message used when it is not possible to parse the JSON content.
	DetailMalformedJSON = "Malformed JSON"
	// DetailUserIsNotAllowedToPerformOperation is the error message when the user cannot perform an operation.
	DetailUserIsNotAllowedToPerformOperation = "Not allowed"
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
	w.Header().Set("Content-Type", DefaultContentType)
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{
		"title":  http.StatusText(statusCode),
		"detail": detail,
	})
}

func getIntOrDefault(value string, defaultValue int) int {
	v, err := strconv.Atoi(value)
	if err != nil {
		v = defaultValue
	}

	return v
}

func getStringSlice(value string) []string {
	var slice []string

	if value == "" {
		return slice
	}

	for _, v := range strings.Split(value, ",") {
		slice = append(slice, strings.TrimSpace(v))
	}

	return slice
}
