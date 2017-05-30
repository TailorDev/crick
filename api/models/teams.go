package models

import (
	"github.com/lib/pq"
	uuid "github.com/satori/go.uuid"
)

var (
	createTeam = `INSERT INTO teams (id, name, projects, user_ids, owner_id)
	VALUES ($1, $2, $3, $4, $5);`

	selectTeamsByUserID = `SELECT * FROM teams WHERE $1=ANY(user_ids);`

	selectUsersByID = `SELECT * FROM users WHERE id=ANY($1);`
)

// Team is a structure representing a Crick team, i.e. a set of users and
// projects shared among them. NOTE: right now, projects are shared without any
// permission granted by the users, as soon as they have a project named that
// is contained into the Projects of the team.
type Team struct {
	ID       uuid.UUID      `db:"id" json:"id"`
	Name     string         `db:"name" json:"name"`
	Projects pq.StringArray `db:"projects" json:"projects"`
	UserIDs  []uuid.UUID    `db:"user_ids" json:"-"`
	OwnerID  uuid.UUID      `db:"owner_id" json:"-"`
	Users    []User         `db:"-" json:"users"`
}

// Teams is a structure representing a set of teams. Its purpose is mainly to
// ease the JSON serialization (to return a root key).
type Teams struct {
	Teams []Team `json:"teams"`
}

// HasUserID returns true if the given user id is part of the team, false
// otherwise.
func (t *Team) HasUserID(id uuid.UUID) bool {
	for _, v := range t.UserIDs {
		if v == id {
			return true
		}
	}
	return false
}

// AddUser adds a given User to the team.
func (t *Team) AddUser(u User) {
	t.Users = append(t.Users, u)
}

// NewTeams returns an instance of NewTeams.
func NewTeams() Teams {
	return Teams{
		Teams: []Team{},
	}
}

// GetTeamsWithUsers returns the user's teams.
func (r DatabaseRepository) GetTeamsWithUsers(userID uuid.UUID) (Teams, error) {
	teamsWithUsers := NewTeams()
	rows, err := r.db.Queryx(selectTeamsByUserID, userID)
	if err != nil {
		return teamsWithUsers, err
	}

	// Store the different User IDs to be able to return the teams and their users.
	var ids []uuid.UUID

	// This is needed since []uuid.UUID is not supported out of the box in the
	// go.uuid library.
	var teams []Team
	for rows.Next() {
		var t Team
		err := rows.Scan(&t.ID, &t.Name, &t.Projects, pq.Array(&t.UserIDs), &t.OwnerID)
		if err != nil {
			return teamsWithUsers, err
		}
		for _, id := range t.UserIDs {
			ids = append(ids, id)
		}
		teams = append(teams, t)
	}

	// Now retrieve the users.
	var users []User
	if err := r.db.Select(&users, selectUsersByID, pq.Array(ids)); err != nil {
		return teamsWithUsers, err
	}

	// Add users to the different teams.
	for _, team := range teams {
		for _, u := range users {
			if team.HasUserID(u.ID) {
				team.AddUser(u)
			}
		}
		teamsWithUsers.Teams = append(teamsWithUsers.Teams, team)
	}

	return teamsWithUsers, nil
}

// CreateNewTeam creates a new team and persists it.
func (r DatabaseRepository) CreateNewTeam(team Team) error {
	_, err := r.db.Exec(createTeam, team.ID, team.Name, team.Projects, pq.Array(team.UserIDs), team.OwnerID)

	return err
}
