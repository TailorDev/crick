package models

import (
	"github.com/jmoiron/sqlx"
	uuid "github.com/satori/go.uuid"
)

type Project struct {
	ID     uuid.UUID `db:"id" json:"id"`
	Name   string    `json:"name"`
	UserID uuid.UUID `db:"user_id"`
}

func GetProjects(db *sqlx.DB, userID string) ([]Project, error) {
	q := `SELECT * FROM projects WHERE user_id=$1;`

	projects := []Project{}
	if err := db.Select(&projects, q, userID); err != nil {
		return nil, err
	}

	return projects, nil
}
