package models

import (
	"github.com/jmoiron/sqlx"
	uuid "github.com/satori/go.uuid"
)

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

func NewProject(name string, userID uuid.UUID) *Project {
	return &Project{
		ID:     uuid.NewV4(),
		Name:   name,
		UserID: userID,
	}
}

func CreateNewProject(db *sqlx.DB, name string, userID uuid.UUID) (*Project, error) {
	p := NewProject(name, userID)
	_, err := db.NamedExec(createProject, p)

	return p, err
}

func GetProjects(db *sqlx.DB, userID uuid.UUID) ([]Project, error) {
	projects := []Project{}
	if err := db.Select(&projects, selectProjectsByUserID, userID); err != nil {
		return nil, err
	}

	return projects, nil
}

func GetProjectByName(db *sqlx.DB, userID uuid.UUID, name string) (*Project, error) {
	p := &Project{}
	if err := db.Get(p, selectProjectByName, userID, name); err != nil {
		return nil, err
	}

	return p, nil
}
