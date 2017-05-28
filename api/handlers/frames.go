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
	DetailInvalidRequest        = "Invalid request"
	DetailMalformedJSON         = "Malformed JSON"
	DetailProjectCreationFailed = "Project creation failed"
	DetailFrameCreationFailed   = "Frame creation failed"
	DetailFrameSelectionFailed  = "Frame selection failed"
)

// BulkInsertFrames handles the bulk insertion of Watson frames.
func (h Handler) BulkInsertFrames(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		middlewares.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	frames := []models.Frame{}
	if err := json.Unmarshal(body, &frames); err != nil {
		h.logger.Error("unmarshal JSON frames to synchronize", zap.Error(err))
		middlewares.SendError(w, http.StatusBadRequest, DetailMalformedJSON)
		return
	}

	for _, f := range frames {
		p, _ := models.GetProjectByName(h.db, user.ID, f.ProjectName)
		if p == nil {
			p, err = models.CreateNewProject(h.db, f.ProjectName, user.ID)
			if err != nil {
				middlewares.SendError(w, http.StatusInternalServerError, DetailProjectCreationFailed)
				return
			}
		}

		f.ProjectID = p.ID
		_, err := models.CreateNewFrame(h.db, f)
		if err != nil {
			h.logger.Error("create new frame", zap.Error(err))
			middlewares.SendError(w, http.StatusInternalServerError, DetailFrameCreationFailed)
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
		frames, err = models.GetFrames(h.db, user.ID)
		if err != nil {
			h.logger.Error("get frames", zap.Error(err))
			middlewares.SendError(w, http.StatusInternalServerError, DetailFrameSelectionFailed)
			return
		}
	} else {
		frames, err = models.GetFramesSince(h.db, user.ID, date)
		if err != nil {
			h.logger.Error("get frames since", zap.Error(err))
			middlewares.SendError(w, http.StatusInternalServerError, DetailFrameSelectionFailed)
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
		middlewares.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	frames, err := models.GetFramesForProject(h.db, user.ID, projectID)
	if err != nil {
		h.logger.Error("get frames for project", zap.Error(err))
		middlewares.SendError(w, http.StatusInternalServerError, DetailGetProjectsFailed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(frames)
}
