package handlers

import (
	"encoding/json"
	"net/http"

	"go.uber.org/zap"

	"github.com/TailorDev/crick/api/middlewares"
	"github.com/julienschmidt/httprouter"
)

var (
	DetailGetProjectsFailed = "Failed to retrieve projects"
)

// GetProjects returns the user's projects.
func (h Handler) GetProjects(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	projects, err := h.repository.GetProjects(user.ID)
	if err != nil {
		h.logger.Error("get projects", zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailGetProjectsFailed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"projects": projects,
	})
}
