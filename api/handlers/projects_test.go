package handlers_test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/TailorDev/crick/api/handlers"
	"github.com/TailorDev/crick/api/models"
	"github.com/julienschmidt/httprouter"
	"go.uber.org/zap"
)

func TestGetProjects(t *testing.T) {
	r := &MockRepository{
		Projects: models.Projects{
			Projects: []models.Project{
				models.Project{},
			},
		},
	}
	h := handlers.New(r, zap.NewNop())

	router := httprouter.New()
	router.GET("/test-endpoint", h.GetProjects)

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

	var projects models.Projects
	if err := json.Unmarshal(rr.Body.Bytes(), &projects); err != nil {
		t.Fatal(err)
	}

	if len(projects.Projects) != 1 {
		t.Fatalf("Expected 1 project, got: %d", len(projects.Projects))
	}
}

func TestGetProjectsWithError(t *testing.T) {
	r := &MockRepository{
		Err: fmt.Errorf("database error"),
	}
	h := handlers.New(r, zap.NewNop())

	router := httprouter.New()
	router.GET("/test-endpoint", h.GetProjects)

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
