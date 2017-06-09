package models

import (
	"github.com/lib/pq"
	uuid "github.com/satori/go.uuid"
)

var (
	createTeam = `INSERT INTO teams (id, name, projects, user_ids, owner_id)
	VALUES ($1, $2, $3, $4, $5);`

	selectTeamsByUserID = `SELECT * FROM teams WHERE $1=ANY(user_ids);`

	// This query is used to retrieve teams' members/users.
	selectUsersByID = `SELECT * FROM users WHERE id=ANY($1);`

	selectTeamByID = `SELECT * FROM teams WHERE id=$1;`

	updateTeam = `UPDATE teams SET name=$2, projects=$3, user_ids=$4 WHERE id=$1;`

	deleteTeam = `DELETE FROM teams WHERE id=$1;`
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
	OwnerID  uuid.UUID      `db:"owner_id" json:"owner_id"`
	Users    []User         `db:"-" json:"users"`
}

// TeamInput is a structure representing the data received by a handler when a
// Team is about to be created or updated. Its purpose is to unmarshal the
// request data into this structure.
type TeamInput struct {
	ID       uuid.UUID   `json:"id"`
	Name     string      `json:"name"`
	Projects []string    `json:"projects"`
	UserIDs  []uuid.UUID `json:"user_ids"`
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

// HasProject returns true is the team has a given project, false otherwise.
func (t *Team) HasProject(project string) bool {
	for _, p := range t.Projects {
		if p == project {
			return true
		}
	}
	return false
}

// AddProject adds a project to the team and ensures unicity.
func (t *Team) AddProject(project string) {
	if !t.HasProject(project) {
		t.Projects = append(t.Projects, project)
	}
}

// SetProjects sets the project of the team.
func (t *Team) SetProjects(projects []string) {
	t.Projects = []string{}
	for _, p := range projects {
		t.AddProject(p)
	}
}

// AddUserID adds a user ID to the team and ensures unicity.
func (t *Team) AddUserID(ID uuid.UUID) {
	if !t.HasUserID(ID) {
		t.UserIDs = append(t.UserIDs, ID)
	}
}

// SetUserIDs sets the user IDs of the team.
func (t *Team) SetUserIDs(userIDs []uuid.UUID) {
	t.UserIDs = []uuid.UUID{}
	for _, id := range userIDs {
		t.AddUserID(id)
	}
}

// NewTeams returns an instance of NewTeams.
func NewTeams() Teams {
	return Teams{
		Teams: []Team{},
	}
}

// NewTeamFromInput instanciates a new Team based on the given TeamInput. Each
// Team must have a User who is a owner, hence the need for a ownerID.
func NewTeamFromInput(in TeamInput, ownerID uuid.UUID) Team {
	team := Team{
		ID:      uuid.NewV4(),
		Name:    in.Name,
		OwnerID: ownerID,
	}
	team.SetProjects(in.Projects)
	team.SetUserIDs(append(in.UserIDs, ownerID))

	return team
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

// GetTeamByID returns a team.
func (r DatabaseRepository) GetTeamByID(teamID uuid.UUID) (*Team, error) {
	t := &Team{}
	row := r.db.QueryRow(selectTeamByID, teamID)
	err := row.Scan(&t.ID, &t.Name, &t.Projects, pq.Array(&t.UserIDs), &t.OwnerID)
	if err != nil {
		return t, err
	}

	// retrieve Users as it is likely needed in the API response
	err = r.db.Select(&t.Users, selectUsersByID, pq.Array(t.UserIDs))

	return t, err
}

// UpdateTeam updates a team, and also retrieves and sets its Users.
func (r DatabaseRepository) UpdateTeam(team *Team) error {
	// update the team
	_, err := r.db.Exec(updateTeam, team.ID, team.Name, team.Projects, pq.Array(team.UserIDs))
	if err != nil {
		return err
	}

	// retrieve Users as it is likely needed in the API response
	err = r.db.Select(&team.Users, selectUsersByID, pq.Array(team.UserIDs))

	return err
}

// DeleteTeam deletes a team, forever.
func (r DatabaseRepository) DeleteTeam(team *Team) error {
	// delete the team
	_, err := r.db.Exec(deleteTeam, team.ID)

	return err
}
