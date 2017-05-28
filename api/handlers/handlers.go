package handlers

import (
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
