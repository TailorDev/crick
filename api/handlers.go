package main

import (
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (h Handler) Get(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fmt.Fprintf(w, "Hello, World!")
}
