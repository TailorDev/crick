package models

import (
	"github.com/lib/pq"
	uuid "github.com/satori/go.uuid"
)

var (
	createTeam = `INSERT INTO teams (id, name, projects, user_ids, owner_id)
	VALUES ($1, $2, $3, $4, $5);`

	selectTeamsByUserID = `SELECT * FROM teams
	WHERE owner_id=$1
	OR $1=ANY(user_ids);`
)

// Team is a structure representing a Crick team, i.e. a set of users and
// projects shared among them. NOTE: right now, projects are shared without any
// permission granted by the users, as soon as they have a project named that
// is contained into the Projects of the team.
type Team struct {
	ID       uuid.UUID      `db:"id" json:"id"`
	Name     string         `db:"name" json:"name"`
	Projects pq.StringArray `db:"projects" json:"projects"`
	UserIDs  []uuid.UUID    `db:"user_ids" json:"user_ids"`
	OwnerID  uuid.UUID      `db:"owner_id" json:"-"`
}

// Teams is a structure representing a set of teams. Its purpose is mainly to
// ease the JSON serialization (to return a root key).
type Teams struct {
	Teams []Team `json:"teams"`
}

// GetTeams returns the user's teams.
func (r DatabaseRepository) GetTeams(userID uuid.UUID) (Teams, error) {
	teams := Teams{}
	rows, err := r.db.Queryx(selectTeamsByUserID, userID)
	if err != nil {
		return teams, err
	}

	// This is needed since []uuid.UUID is not supported out of the box in the
	// go.uuid library.
	for rows.Next() {
		var t Team
		err := rows.Scan(&t.ID, &t.Name, &t.Projects, pq.Array(&t.UserIDs), &t.OwnerID)
		if err != nil {
			return teams, nil
		}

		teams.Teams = append(teams.Teams, t)
	}

	return teams, nil
}

// CreateNewTeam creates a new team and persists it.
func (r DatabaseRepository) CreateNewTeam(team Team) error {
	_, err := r.db.Exec(createTeam, team.ID, team.Name, team.Projects, pq.Array(team.UserIDs), team.OwnerID)

	return err
}
