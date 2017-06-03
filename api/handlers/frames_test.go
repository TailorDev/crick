package handlers_test

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/TailorDev/crick/api/handlers"
	"github.com/julienschmidt/httprouter"
	uuid "github.com/satori/go.uuid"
	"go.uber.org/zap"
)

func TestGetFrames(t *testing.T) {
	r := &MockRepository{}
	h := handlers.New(r, zap.NewNop())

	router := httprouter.New()
	router.GET("/test-endpoint", h.GetFrames)

	req, err := http.NewRequest("GET", "/test-endpoint", nil)
	if err != nil {
		t.Fatal(err)
	}

	req = req.WithContext(AddUserToContext(req.Context(), GetFakeUser()))

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Fatalf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	query := r.QueryBuilder.ToSQL()
	expected := `SELECT frames.*, projects.name AS project_name FROM frames INNER JOIN projects ON (frames.project_id = projects.id) WHERE projects.user_id=$1 ORDER BY frames.start_at DESC LIMIT 50 OFFSET 0`

	if query != expected {
		t.Fatalf("invalid SQL query, expected: `%s` but got: `%s`", expected, query)
	}
}

func TestGetFramesWithProjectID(t *testing.T) {
	r := &MockRepository{}
	h := handlers.New(r, zap.NewNop())

	router := httprouter.New()
	router.GET("/test-endpoint", h.GetFrames)

	req, err := http.NewRequest("GET", fmt.Sprintf("/test-endpoint?projectId=%s", uuid.NewV4()), nil)
	if err != nil {
		t.Fatal(err)
	}

	req = req.WithContext(AddUserToContext(req.Context(), GetFakeUser()))

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Fatalf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	query := r.QueryBuilder.ToSQL()
	expected := `SELECT frames.*, projects.name AS project_name FROM frames INNER JOIN projects ON (frames.project_id = projects.id) WHERE projects.user_id=$1 AND frames.project_id=$2 ORDER BY frames.start_at DESC LIMIT 50 OFFSET 0`

	if query != expected {
		t.Fatalf("invalid SQL query, expected: `%s` but got: `%s`", expected, query)
	}
}

func TestGetFramesWithTeamID(t *testing.T) {
	r := &MockRepository{}
	h := handlers.New(r, zap.NewNop())

	router := httprouter.New()
	router.GET("/test-endpoint", h.GetFrames)

	req, err := http.NewRequest("GET", fmt.Sprintf("/test-endpoint?teamId=%s", uuid.NewV4()), nil)
	if err != nil {
		t.Fatal(err)
	}

	req = req.WithContext(AddUserToContext(req.Context(), GetFakeUser()))

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Fatalf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	query := r.QueryBuilder.ToSQL()
	expected := `SELECT frames.*, projects.name AS project_name FROM frames INNER JOIN projects ON (frames.project_id = projects.id) INNER JOIN teams ON (projects.user_id=ANY(teams.user_ids)) WHERE projects.name=ANY(teams.projects) AND teams.id=$1 ORDER BY frames.start_at DESC LIMIT 50 OFFSET 0`

	if query != expected {
		t.Fatalf("invalid SQL query, expected: `%s` but got: `%s`", expected, query)
	}
}
