package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (h Handler) UsersGetMe(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte("{ \"username\": \"willdurand\", \"fullname\": \"William Durand\" }"))
}
