package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"go.uber.org/zap"

	"github.com/julienschmidt/httprouter"
	"github.com/satori/go.uuid"
)

type User struct {
	ID      uuid.UUID `db:"id"`
	Auth0ID string    `db:"auth0_id"`
	Login   string
}

func (h Handler) UsersGetMe(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id := r.Context().Value("user_id").(string)

	u := User{}
	err := h.db.Get(&u, "SELECT * FROM users WHERE auth0_id=$1;", id)
	if err != nil {
		if err == sql.ErrNoRows {
			h.logger.Info("create user", zap.String("auth0_id", id))
		} else {
			h.logger.Error("finding a user by auth0_id", zap.Error(err))
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(fmt.Sprintf("{ \"user_id\": \"%s\", \"username\": \"willdurand\", \"fullname\": \"William Durand\" }", id)))
}
