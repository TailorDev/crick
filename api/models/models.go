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
	// GetFramesForProject returns all the frames for a given project.
	GetFramesForProject(userID, projectID uuid.UUID) ([]Frame, error)

	// CreateNewProject creates a new project, persists it and returns it.
	CreateNewProject(name string, userID uuid.UUID) (*Project, error)
	// GetProjects returns all the user's projects.
	GetProjects(userID uuid.UUID) ([]Project, error)
	// GetProjectByName returns a project corresponding to `name`.
	GetProjectByName(userID uuid.UUID, name string) (*Project, error)

	// CreateNewUser creates a new user, persists it and returns it.
	CreateNewUser(auth0ID, login string) (*User, error)
	// GetUserByAuth0ID returns a user corresponding to the given Auth0 id.
	GetUserByAuth0ID(auth0ID string) (*User, error)
	// GetUserByToken returns a user corresponding to the given API token.
	GetUserByToken(token string) (*User, error)

	// GetTeams returns the user's teams.
	GetTeams(userID uuid.UUID) ([]Team, error)
	// CreateNewTeam creates a new team and persists it.
	CreateNewTeam(team Team) error
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
