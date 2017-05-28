package handlers

import (
	"encoding/json"
	"net/http"

	"go.uber.org/zap"

	"github.com/TailorDev/crick/api/middlewares"
	"github.com/TailorDev/crick/api/models"
	"github.com/julienschmidt/httprouter"
)

var (
	DetailGetProjectsFailed = "Failed to retrieve projects"
)

// GetProjects returns the user's projects.
func (h Handler) GetProjects(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	projects, err := models.GetProjects(h.db, user.ID)
	if err != nil {
		h.logger.Error("get projects", zap.Error(err))
		middlewares.SendError(w, http.StatusInternalServerError, DetailGetProjectsFailed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}
