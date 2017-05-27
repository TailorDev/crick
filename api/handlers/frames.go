package handlers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/TailorDev/crick/api/middlewares"
	"github.com/TailorDev/crick/api/models"
	"github.com/julienschmidt/httprouter"
	"go.uber.org/zap"
)

func (h Handler) BulkInsertFrames(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	body, _ := ioutil.ReadAll(r.Body)
	// TODO: handle error

	frames := []models.Frame{}
	if err := json.Unmarshal(body, &frames); err != nil {
		h.logger.Error("unmarshal JSON frames to synchronize", zap.Error(err))
		// TODO: return error
	}

	for _, f := range frames {
		p, _ := models.GetProjectByName(h.db, user.ID, f.ProjectName)
		if p == nil {
			p, _ = models.CreateNewProject(h.db, f.ProjectName, user.ID)
			// TODO: handle error
		}

		f.ProjectID = p.ID
		_, err := models.CreateNewFrame(h.db, f)
		if err != nil {
			h.logger.Error("create new frame", zap.Error(err))
		}
		// TODO: handle error
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

func (h Handler) GetFrames(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())
	var frames []models.Frame

	ls := r.URL.Query().Get("last_sync")
	date, err := time.Parse("2006-01-02T15:04:05-07:00", ls)

	if err != nil {
		frames, err = models.GetFrames(h.db, user.ID)
		if err != nil {
			h.logger.Error("get frames", zap.Error(err))
		}
	} else {
		frames, err = models.GetFramesSince(h.db, user.ID, date)
		if err != nil {
			h.logger.Error("get frames since", zap.Error(err))
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(frames)
}
