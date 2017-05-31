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
	// DetailProjectCreationFailed is the error message when inserting a project in database has failed.
	DetailProjectCreationFailed = "Project creation failed"
	// DetailFrameCreationFailed is the error message when inserting a frame in database has failed.
	DetailFrameCreationFailed = "Frame creation failed"
	// DetailFrameSelectionFailed is the error message when fetching frames from database has failed.
	DetailFrameSelectionFailed = "Frame selection failed"
	// DetailGetProjectFailed is the error message when the project to retrieve does not exist in database.
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

	w.Header().Set("Content-Type", DefaultContentType)
	w.WriteHeader(http.StatusCreated)
}

// GetFramesSince returns the user's frames, optionally since `last_sync` date.
func (h Handler) GetFramesSince(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())
	var frames []models.Frame

	ls := r.URL.Query().Get("last_sync")
	date, err := time.Parse("2006-01-02T15:04:05-07:00", ls)

	if err != nil {
		frames, err = h.repository.GetFrames(user.ID)
		if err != nil {
			h.logger.Error("get frames since", zap.Stringer("user_id", user.ID), zap.Error(err))
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

	w.Header().Set("Content-Type", DefaultContentType)
	json.NewEncoder(w).Encode(frames)
}

// GetFrames returns the user's frames for the given project.
func (h Handler) GetFrames(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	// query parameters
	page := getIntOrDefault(r.URL.Query().Get("page"), 1)
	limit := getIntOrDefault(r.URL.Query().Get("limit"), 50)
	//from := getTimeOrNil(r.URL.Query().Get("from"))
	//to := getTimeOrNil(r.URL.Query().Get("to"))
	//tags := getStringSlice(r.URL.Query().Get("tags"))
	projectId := r.URL.Query().Get("projectId")
	projects := getStringSlice(r.URL.Query().Get("projects"))
	//teamId := r.URL.Query().Get("teamId")

	if projectId != "" {
		if len(projects) > 0 {
			h.logger.Warn(
				"cannot have both projectId and projects at the same time",
				zap.Strings("projects", projects),
			)
			h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
			return
		}

		projectID, err := uuid.FromString(projectId)
		if err != nil {
			h.logger.Warn(
				"failed to parse project ID",
				zap.Stringer("user_id", user.ID),
				zap.String("project_id", projectId),
				zap.Error(err),
			)
			h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
			return
		}

		project, err := h.repository.GetProjectByID(user.ID, projectID)
		if err != nil {
			h.logger.Error(
				"get project by id",
				zap.Stringer("user_id", user.ID),
				zap.Stringer("project_id", projectID),
				zap.Error(err),
			)
			h.SendError(w, http.StatusInternalServerError, DetailGetProjectFailed)
			return

		}

		frames, err := h.repository.GetFramesForProject(user.ID, projectID, limit, page)
		if err != nil {
			h.logger.Error(
				"get frames",
				zap.Stringer("user_id", user.ID),
				zap.Stringer("project_id", projectID),
				zap.Error(err),
			)
			h.SendError(w, http.StatusInternalServerError, DetailGetProjectFailed)
			return
		}

		w.Header().Set("Content-Type", DefaultContentType)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"meta": map[string]interface{}{
				"page": map[string]interface{}{
					"limit": limit,
				},
				"project": project,
			},
			"frames": frames,
		})
	} else {
		w.Header().Set("Content-Type", DefaultContentType)
		json.NewEncoder(w).Encode(map[string]interface{}{})
	}
}
