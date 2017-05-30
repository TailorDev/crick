package handlers

import (
	"encoding/json"
	"net/http"

	"go.uber.org/zap"

	"github.com/TailorDev/crick/api/middlewares"
	"github.com/julienschmidt/httprouter"
)

var (
	// The error message used when fetching user's projects from database has failed.
	DetailGetProjectsFailed = "Failed to retrieve projects"
)

// GetProjects returns the user's projects.
func (h Handler) GetProjects(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	projects, err := h.repository.GetProjects(user.ID)
	if err != nil {
		h.logger.Error("get projects", zap.Stringer("user_id", user.ID), zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailGetProjectsFailed)
		return
	}

	w.Header().Set("Content-Type", DefaultContentType)
	json.NewEncoder(w).Encode(projects)
}
