package models

import (
	"database/sql"
	"encoding/json"
)

type NullString struct {
	sql.NullString
}

func (r NullString) MarshalJSON() ([]byte, error) {
	return json.Marshal(r.String)
}
