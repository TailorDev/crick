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
	// DetailGetTeamsFailed is the error message used when fetching teams from database has failed.
	DetailGetTeamsFailed = "Failed to retrieve teams"
	// DetailTeamCreationFailed is the error message used when inserting a team in database has failed.
	DetailTeamCreationFailed = "Team creation failed"
	// DetailGetTeamFailed is the error message used when retrieving a team from database has failed.
	DetailGetTeamFailed = "Failed to retrieve team"
)

// GetTeams returns the user's teams.
func (h Handler) GetTeams(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	teams, err := h.repository.GetTeamsWithUsers(user.ID)
	if err != nil {
		h.logger.Error("get teams", zap.Stringer("user_id", user.ID), zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailGetTeamsFailed)
		return
	}

	w.Header().Set("Content-Type", DefaultContentType)
	json.NewEncoder(w).Encode(teams)
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

	input := models.TeamInput{}
	if err := json.Unmarshal(body, &input); err != nil {
		h.logger.Warn("unmarshal JSON team to create", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailMalformedJSON)
		return
	}

	// TODO: validate team.UserIDs
	// TODO: validate team.Projects
	team := models.NewTeamFromInput(input, user.ID)

	if err := h.repository.CreateNewTeam(team); err != nil {
		h.logger.Error("create new team", zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailTeamCreationFailed)
		return
	}

	w.Header().Set("Content-Type", DefaultContentType)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id": team.ID,
	})
}

// UpdateTeam allows to modify an existing team.
func (h Handler) UpdateTeam(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	teamID, err := uuid.FromString(ps.ByName("id"))
	if err != nil {
		h.logger.Warn("update team", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	team, err := h.repository.GetTeamByID(teamID)
	if err != nil {
		h.logger.Error("update team", zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailGetTeamFailed)
		return

	}

	user := middlewares.GetCurrentUser(r.Context())
	if !user.IsOwnerOfTeam(*team) {
		h.SendError(w, http.StatusForbidden, DetailUserIsNotAllowedToPerformOperation)
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		h.logger.Warn("update team", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	input := models.TeamInput{}
	if err := json.Unmarshal(body, &input); err != nil {
		h.logger.Warn("unmarshal JSON team to create", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailMalformedJSON)
		return
	}

	if input.ID != teamID {
		h.logger.Warn("team ids mismatch", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	team.Name = input.Name
	team.Projects = input.Projects
	team.UserIDs = append(input.UserIDs, user.ID)

	// TODO: persist

	w.Header().Set("Content-Type", DefaultContentType)
	json.NewEncoder(w).Encode(team)
}
