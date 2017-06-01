// Package models contains the data structures and functions.
package models

import (
	"time"

	"github.com/jmoiron/sqlx"
	uuid "github.com/satori/go.uuid"
)

// Repository is the main model interface, exposing all functions to manipulate
// the different data structures.
type Repository interface {
	// GetFrames returns all the user's frames.
	GetFrames(userID uuid.UUID) ([]Frame, error)
	// GetFramesSince returns the user's fraces since date.
	GetFramesSince(userID uuid.UUID, date time.Time) ([]Frame, error)
	// CreateNewFrame creates a new frame and persists it.
	CreateNewFrame(frame Frame) error
	// GetFramesWithQueryBuilder returns the frames matching the query from the
	// QueryBuilder. It returns the number of results as first return value,
	// then the result set paginated.
	GetFramesWithQueryBuilder(qb QueryBuilder) (int, []Frame, error)

	// CreateNewProject creates a new project, persists it and returns it.
	CreateNewProject(name string, userID uuid.UUID) (*Project, error)
	// GetProjects returns all the user's projects.
	GetProjects(userID uuid.UUID) (Projects, error)
	// GetProjectByName returns a project corresponding to `name`.
	GetProjectByName(userID uuid.UUID, name string) (*Project, error)
	// GetProjectByID returns a project given its id and user ID.
	GetProjectByID(userID, projectID uuid.UUID) (*Project, error)

	// CreateNewUser creates a new user, persists it and returns it.
	CreateNewUser(auth0ID, login, avatarURL string) (*User, error)
	// GetUserByAuth0ID returns a user corresponding to the given Auth0 id.
	GetUserByAuth0ID(auth0ID string) (*User, error)
	// GetUserByToken returns a user corresponding to the given API token.
	GetUserByToken(token string) (*User, error)
	// GetUsersByLoginLike returns a set of users based on the given login, it
	// is used for autocompletion for instance.
	GetUsersByLoginLike(login string) (Users, error)

	// GetTeamsWithUsers returns the user's teams.
	GetTeamsWithUsers(userID uuid.UUID) (Teams, error)
	// CreateNewTeam creates a new team and persists it.
	CreateNewTeam(team Team) error
	// GetTeamByID returns a team.
	GetTeamByID(teamID uuid.UUID) (*Team, error)
	// UpdateTeam updates a team, and also retrieves and sets its Users.
	UpdateTeam(team *Team) error
	// DeleteTeam deletes a team, forever.
	DeleteTeam(team *Team) error

	// GetProjectWorkloads returns a set of workloads for a given user and project.
	GetProjectWorkloads(userID, projectID uuid.UUID) (*Workloads, error)
}

// DatabaseRepository is an implementation of the `Repository` interface with a
// database.
type DatabaseRepository struct {
	db *sqlx.DB
}

// NewDatabaseRepository returns an instance of `DatabaseRepository`.
func NewDatabaseRepository(db *sqlx.DB) Repository {
	return DatabaseRepository{
		db: db,
	}
}
