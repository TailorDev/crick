package main

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"go.uber.org/zap"

	"github.com/TailorDev/crick/api/models"
	"github.com/julienschmidt/httprouter"
)

func (h Handler) UsersGetMe(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id := r.Context().Value("user_id").(string)

	u := &models.User{}
	err := h.db.Get(u, "SELECT * FROM users WHERE auth0_id=$1;", id)
	if err != nil {
		if err == sql.ErrNoRows {
			h.logger.Info("create user", zap.String("auth0_id", id))

			u, err = models.CreateUser(h.db, id)
			if err != nil {
				h.logger.Error("creating a user by auth0_id", zap.Error(err))
			}
		} else {
			h.logger.Error("finding a user by auth0_id", zap.Error(err))
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(u)
}
