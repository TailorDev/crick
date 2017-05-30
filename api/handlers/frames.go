package handlers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/TailorDev/crick/api/middlewares"
	"github.com/TailorDev/crick/api/models"
	"github.com/julienschmidt/httprouter"
	uuid "github.com/satori/go.uuid"
	"go.uber.org/zap"
)

var (
	// The error message when inserting a project in database has failed.
	DetailProjectCreationFailed = "Project creation failed"
	// The error message when inserting a frame in database has failed.
	DetailFrameCreationFailed = "Frame creation failed"
	// The error message when fetching frames from database has failed.
	DetailFrameSelectionFailed = "Frame selection failed"
	// The error message when the project to retrieve does not exist in database.
	DetailGetProjectFailed = "Unknown project"
)

// BulkInsertFrames handles the bulk insertion of Watson frames.
func (h Handler) BulkInsertFrames(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		h.logger.Warn("bulk insert frames", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	frames := []models.Frame{}
	if err := json.Unmarshal(body, &frames); err != nil {
		h.logger.Warn("unmarshal JSON frames to synchronize", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailMalformedJSON)
		return
	}

	for _, f := range frames {
		p, err1 := h.repository.GetProjectByName(user.ID, f.ProjectName)
		if err1 != nil {
			p, err = h.repository.CreateNewProject(f.ProjectName, user.ID)
			if err != nil {
				h.logger.Error(
					"create new project",
					zap.String("project_name", f.ProjectName),
					zap.Stringer("user_id", user.ID),
					zap.Error(err),
				)
				h.SendError(w, http.StatusInternalServerError, DetailProjectCreationFailed)
				return
			}
		}

		f.ProjectID = p.ID
		if err := h.repository.CreateNewFrame(f); err != nil {
			h.logger.Error("create new frame", zap.Error(err))
			h.SendError(w, http.StatusInternalServerError, DetailFrameCreationFailed)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

// GetFrames returns the user's frames, optionally since `last_sync` date.
func (h Handler) GetFrames(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())
	var frames []models.Frame

	ls := r.URL.Query().Get("last_sync")
	date, err := time.Parse("2006-01-02T15:04:05-07:00", ls)

	if err != nil {
		frames, err = h.repository.GetFrames(user.ID)
		if err != nil {
			h.logger.Error("get frames", zap.Stringer("user_id", user.ID), zap.Error(err))
			h.SendError(w, http.StatusInternalServerError, DetailFrameSelectionFailed)
			return
		}
	} else {
		frames, err = h.repository.GetFramesSince(user.ID, date)
		if err != nil {
			h.logger.Error(
				"get frames since",
				zap.Stringer("user_id", user.ID),
				zap.Time("date", date),
				zap.Error(err),
			)
			h.SendError(w, http.StatusInternalServerError, DetailFrameSelectionFailed)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(frames)
}

// GetFramesForProject returns the user's frames for the given project.
func (h Handler) GetFramesForProject(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	projectID, err := uuid.FromString(ps.ByName("id"))
	if err != nil {
		h.logger.Warn("failed to parse user ID", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	// TODO: test if project exists, maybe

	frames, err := h.repository.GetFramesForProject(user.ID, projectID)
	if err != nil {
		h.logger.Error(
			"get frames for project",
			zap.Stringer("user_id", user.ID),
			zap.Stringer("project_id", projectID),
			zap.Error(err),
		)
		h.SendError(w, http.StatusInternalServerError, DetailGetProjectFailed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"frames": frames,
	})
}
