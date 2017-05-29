package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/TailorDev/crick/api/models"
	"go.uber.org/zap"
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

func (h Handler) SendError(w http.ResponseWriter, statusCode int, detail string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{
		"title":  http.StatusText(statusCode),
		"detail": detail,
	})
}
