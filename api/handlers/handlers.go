package handlers

import (
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

// Handler is the structure that contains the different HTTP handlers.
type Handler struct {
	db     *sqlx.DB
	logger *zap.Logger
}

// New creates the main handler.
func New(db *sqlx.DB, logger *zap.Logger) Handler {
	return Handler{
		db:     db,
		logger: logger,
	}
}
