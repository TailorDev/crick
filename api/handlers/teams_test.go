package handlers_test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"go.uber.org/zap"

	"github.com/TailorDev/crick/api/handlers"
	"github.com/TailorDev/crick/api/models"
	"github.com/julienschmidt/httprouter"
)

func TestGetTeams(t *testing.T) {
	r := &MockRepository{
		Teams: models.Teams{
			Teams: []models.Team{
				models.Team{},
				models.Team{},
			},
		},
	}
	h := handlers.New(r, zap.NewNop())

	router := httprouter.New()
	router.GET("/test-endpoint", h.GetTeams)

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

	var teams models.Teams
	if err := json.Unmarshal(rr.Body.Bytes(), &teams); err != nil {
		t.Fatal(err)
	}

	if len(teams.Teams) != 2 {
		t.Fatalf("Expected 2 teams, got: %d", len(teams.Teams))
	}
}

func TestGetTeamsWithEmptyResultSet(t *testing.T) {
	r := &MockRepository{
		Teams: models.Teams{},
	}
	h := handlers.New(r, zap.NewNop())

	router := httprouter.New()
	router.GET("/test-endpoint", h.GetTeams)

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

func TestGetTeamsWithError(t *testing.T) {
	r := &MockRepository{
		Err: fmt.Errorf("database error"),
	}
	h := handlers.New(r, zap.NewNop())

	router := httprouter.New()
	router.GET("/test-endpoint", h.GetTeams)

	req, err := http.NewRequest("GET", "/test-endpoint", nil)
	if err != nil {
		t.Fatal(err)
	}

	req = req.WithContext(AddUserToContext(req.Context(), GetFakeUser()))

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusInternalServerError {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusInternalServerError)
	}
}
