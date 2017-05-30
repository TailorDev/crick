package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/TailorDev/crick/api/middlewares"
	"github.com/julienschmidt/httprouter"
)

// UsersGetMe returns information related to the current logged user.
func (h Handler) UsersGetMe(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user := middlewares.GetCurrentUser(r.Context())

	w.Header().Set("Content-Type", DefaultContentType)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":       user.ID,
		"auth0_id": user.Auth0ID,
		"login":    user.Login,
		"token":    user.APIToken,
	})
}
