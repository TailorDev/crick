package handlers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/TailorDev/crick/api/middlewares"
	"github.com/TailorDev/crick/api/models"
	"github.com/julienschmidt/httprouter"
	uuid "github.com/satori/go.uuid"
	"go.uber.org/zap"
)

var (
	// The error message used when fetching teams from database has failed.
	DetailGetTeamsFailed = "Failed to retrieve teams"
	// The error message used when inserting a team in database has failed.
	DetailTeamCreationFailed = "Team creation failed"
)

// GetTeams returns the user's teams.
func (h Handler) GetTeams(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	teams, err := h.repository.GetTeams(user.ID)
	if err != nil {
		h.logger.Error("get teams", zap.Stringer("user_id", user.ID), zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailGetTeamsFailed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"teams": teams,
	})
}

// CreateTeam creates a new team and returns its id.
func (h Handler) CreateTeam(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		h.logger.Warn("create team", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	team := models.Team{}
	if err := json.Unmarshal(body, &team); err != nil {
		h.logger.Warn("unmarshal JSON team to create", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailMalformedJSON)
		return
	}

	// TODO: validate team.UserIDs
	// TODO: validate team.Projects

	team.ID = uuid.NewV4()
	team.OwnerID = user.ID
	team.UserIDs = append(team.UserIDs, user.ID)

	if err := h.repository.CreateNewTeam(team); err != nil {
		h.logger.Error("create new team", zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailTeamCreationFailed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(team)
}
