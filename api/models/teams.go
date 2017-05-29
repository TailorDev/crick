package models

import (
	"github.com/lib/pq"
	uuid "github.com/satori/go.uuid"
)

type Team struct {
	ID       uuid.UUID      `db:"id" json:"id"`
	Name     string         `db:"name" json:"name"`
	Projects pq.StringArray `db:"projects" json:"projects"`
	UserIDs  []uuid.UUID    `db:"user_ids" json:"user_ids"`
	OwnerID  uuid.UUID      `db:"owner_id" json:"-"`
}
