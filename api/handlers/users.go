package handlers

import (
	"encoding/json"
	"net/http"

	"go.uber.org/zap"

	"github.com/TailorDev/crick/api/middleware"
	"github.com/julienschmidt/httprouter"
)

var (
	// DetailGetUsersByLoginFailed is the error message when retrieving users
	// by login in database has failed.
	DetailGetUsersByLoginFailed = "Failed to retrieve users by login"
)

// UsersGetMe returns information related to the current logged user.
func (h Handler) UsersGetMe(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middleware.GetCurrentUser(r.Context())

	w.Header().Set("Content-Type", DefaultContentType)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":         user.ID,
		"login":      user.Login,
		"token":      user.APIToken,
		"avatar_url": user.AvatarURL,
	})
}

// GetUsers returns a list of users. It relies on a query string parameter q to
// autocomplete users.
func (h Handler) GetUsers(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	q := r.URL.Query().Get("q")

	users, err := h.repository.GetUsersByLoginLike(q)
	if err != nil {
		h.logger.Error("get users by login like", zap.String("q", q), zap.Error(err))
		h.SendError(w, http.StatusInternalServerError, DetailGetUsersByLoginFailed)
		return
	}

	w.Header().Set("Content-Type", DefaultContentType)
	json.NewEncoder(w).Encode(users)
}
