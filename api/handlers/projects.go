package handlers

import (
	"encoding/json"
	"net/http"

	"go.uber.org/zap"

	"github.com/TailorDev/crick/api/middleware"
	"github.com/julienschmidt/httprouter"
	uuid "github.com/satori/go.uuid"
)

var (
	// DetailGetProjectsFailed is the error message used when fetching user's
	// projects from database has failed.
	DetailGetProjectsFailed = "Failed to retrieve projects"
	// DetailProjectWorkloadsRetrievalFailed is the error message used when
	// retrieving the project workloads from database has failed.
	DetailProjectWorkloadsRetrievalFailed = "Failed to retrieve project workloads"
)

// GetProjects returns the user's projects.
func (h Handler) GetProjects(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middleware.GetCurrentUser(r.Context())

	projects, err := h.repository.GetProjects(user.ID)
	if err != nil {
		h.logger.Error("get projects", zap.Stringer("user_id", user.ID), zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailGetProjectsFailed)
		return
	}

	w.Header().Set("Content-Type", DefaultContentType)
	json.NewEncoder(w).Encode(projects)
}

// GetProjectWorkloads returns the workloads for a given project.
func (h Handler) GetProjectWorkloads(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middleware.GetCurrentUser(r.Context())

	projectID, err := uuid.FromString(ps.ByName("id"))
	if err != nil {
		h.logger.Warn("get project workloads", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	workloads, err := h.repository.GetProjectWorkloads(user.ID, projectID)
	if err != nil {
		h.logger.Error("get project workloads", zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailProjectWorkloadsRetrievalFailed)
		return
	}

	w.Header().Set("Content-Type", DefaultContentType)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"workloads": workloads,
	})
}
