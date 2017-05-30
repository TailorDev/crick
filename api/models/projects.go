package models

import (
	uuid "github.com/satori/go.uuid"
)

// Project is a structure representing a project. Usually, frames are
// associated to a project, and a project is owned by a user.
type Project struct {
	ID     uuid.UUID `db:"id" json:"id"`
	Name   string    `json:"name"`
	UserID uuid.UUID `db:"user_id" json:"-"`
}

var (
	createProject          = `INSERT INTO projects (id, name, user_id) VALUES (:id, :name, :user_id);`
	selectProjectsByUserID = `SELECT * FROM projects WHERE user_id=$1;`
	selectProjectByName    = `SELECT * FROM projects WHERE user_id=$1 and name=$2;`
)

// NewProject creates and returns a Project instance.
func NewProject(name string, userID uuid.UUID) *Project {
	return &Project{
		ID:     uuid.NewV4(),
		Name:   name,
		UserID: userID,
	}
}

// CreateNewProject creates a new project, persists it and returns it.
func (r DatabaseRepository) CreateNewProject(name string, userID uuid.UUID) (*Project, error) {
	p := NewProject(name, userID)
	_, err := r.db.NamedExec(createProject, p)

	return p, err
}

// GetProjects returns all the user's projects.
func (r DatabaseRepository) GetProjects(userID uuid.UUID) ([]Project, error) {
	projects := []Project{}
	err := r.db.Select(&projects, selectProjectsByUserID, userID)

	return projects, err
}

// GetProjectByName returns a project corresponding to `name`.
func (r DatabaseRepository) GetProjectByName(userID uuid.UUID, name string) (*Project, error) {
	p := &Project{}
	err := r.db.Get(p, selectProjectByName, userID, name)

	return p, err
}
