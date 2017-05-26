package models

import (
	"github.com/jmoiron/sqlx"
	"github.com/satori/go.uuid"
)

type User struct {
	ID      uuid.UUID  `db:"id" json:"id"`
	Auth0ID string     `db:"auth0_id" json:"auth0_id"`
	Login   NullString `json:"login"`
}

func NewUser() *User {
	return &User{}
}

func CreateUser(db *sqlx.DB, auth0_id string) (*User, error) {
	q := `INSERT INTO users (id, auth0_id) VALUES (:id, :auth0_id);`
	u := &User{
		ID:      uuid.NewV4(),
		Auth0ID: auth0_id,
	}

	if _, err := db.NamedExec(q, u); err != nil {
		return nil, err
	}

	return u, nil
}
