package models_test

import (
	"testing"

	"github.com/TailorDev/crick/api/models"
)

func TestIsOwnerOfTeam(t *testing.T) {
	user := models.NewUser("auth0ID", "login")
	team1 := models.Team{OwnerID: user.ID}
	team2 := models.Team{}

	if !user.IsOwnerOfTeam(team1) {
		t.Fatalf("expected user to be owner of the team")
	}

	if user.IsOwnerOfTeam(team2) {
		t.Fatalf("expected user NOT to be owner of the team")
	}
}
