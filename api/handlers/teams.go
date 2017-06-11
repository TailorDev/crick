package handlers

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/TailorDev/crick/api/middleware"
	"github.com/TailorDev/crick/api/models"
	"github.com/julienschmidt/httprouter"
	"github.com/lib/pq"
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
	// DetailTeamUpdateFailed is the error message used when updating a team in database has failed.
	DetailTeamUpdateFailed = "Failed to update the team"
	// DetailTeamNotFound is the error message used when a team does not exist.
	DetailTeamNotFound = "Team not found"
	// DetailTeamDeletionFailed is the error message when deleting a team in database has failed.
	DetailTeamDeletionFailed = "Failed to delete the team"
	// DetailTeamAlreadyExists is the error message when the unique constraint
	// on (team name/owner_id) is violated
	DetailTeamAlreadyExists = "A team with this name already exists"
)

// GetTeams returns the user's teams.
func (h Handler) GetTeams(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middleware.GetCurrentUser(r.Context())

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
	user := middleware.GetCurrentUser(r.Context())

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

	if strings.TrimSpace(input.Name) == "" {
		h.logger.Warn("team name is blank", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	team := models.NewTeamFromInput(input, user.ID)

	if err := h.repository.CreateNewTeam(team); err != nil {
		if err, ok := err.(*pq.Error); ok {
			if err.Code.Name() == "unique_violation" {
				h.SendError(w, http.StatusConflict, DetailTeamAlreadyExists)
				return
			}

			h.logger.Error("create new team", zap.Error(err), zap.String("code_name", err.Code.Name()))
		} else {
			h.logger.Error("create new team", zap.Error(err))
		}

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
		h.handleTeamError(w, "update team", err)
		return
	}

	user := middleware.GetCurrentUser(r.Context())
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

	if strings.TrimSpace(input.Name) == "" {
		h.logger.Warn("team name is blank", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	team.Name = input.Name
	team.SetProjects(input.Projects)
	team.SetUserIDs(append(input.UserIDs, user.ID))

	if err := h.repository.UpdateTeam(team); err != nil {
		if err, ok := err.(*pq.Error); ok {
			if err.Code.Name() == "unique_violation" {
				h.SendError(w, http.StatusConflict, DetailTeamAlreadyExists)
				return
			}

			h.logger.Error("update team", zap.Error(err), zap.String("code_name", err.Code.Name()))
		} else {
			h.logger.Error("update team", zap.Error(err))
		}

		h.SendError(w, http.StatusInternalServerError, DetailTeamUpdateFailed)
		return
	}

	w.Header().Set("Content-Type", DefaultContentType)
	json.NewEncoder(w).Encode(team)
}

// DeleteTeam allows to delete an existing team.
func (h Handler) DeleteTeam(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	teamID, err := uuid.FromString(ps.ByName("id"))
	if err != nil {
		h.logger.Warn("delete team", zap.Error(err))
		h.SendError(w, http.StatusBadRequest, DetailInvalidRequest)
		return
	}

	team, err := h.repository.GetTeamByID(teamID)
	if err != nil {
		h.handleTeamError(w, "delete team", err)
		return
	}

	user := middleware.GetCurrentUser(r.Context())
	if !user.IsOwnerOfTeam(*team) {
		h.SendError(w, http.StatusForbidden, DetailUserIsNotAllowedToPerformOperation)
		return
	}

	if err := h.repository.DeleteTeam(team); err != nil {
		h.logger.Warn("delete team", zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailTeamDeletionFailed)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h Handler) handleTeamError(w http.ResponseWriter, cause string, err error) {
	if err == sql.ErrNoRows {
		h.logger.Warn(cause, zap.Error(err))
		h.SendError(w, http.StatusNotFound, DetailTeamNotFound)
	} else {
		h.logger.Error(cause, zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailGetTeamFailed)
	}
}
