package middlewares

import (
	"encoding/json"
	"net/http"
)

func SendError(w http.ResponseWriter, statusCode int, detail string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{
		"title":  http.StatusText(statusCode),
		"detail": detail,
	})
}
