package handlers_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/TailorDev/crick/api/handlers"
	"github.com/julienschmidt/httprouter"
)

func TestUsersGetMe(t *testing.T) {
	h := handlers.New(nil, nil)

	router := httprouter.New()
	router.GET("/test-endpoint", h.UsersGetMe)

	req, err := http.NewRequest("GET", "/test-endpoint", nil)
	if err != nil {
		t.Fatal(err)
	}

	req = req.WithContext(AddUserToContext(req.Context(), GetFakeUser()))

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}
