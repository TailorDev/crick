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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
