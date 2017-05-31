package models_test

import (
	"testing"

	"github.com/TailorDev/crick/api/models"
)

func TestQueryBuilder(t *testing.T) {
	qb := models.NewQueryBuilder()

	qb.AddSelect("*")
	qb.AddFrom("table")
	assertSQL(t, qb.ToSQL(), `SELECT * FROM table`)
	assertSQL(t, qb.ToCountSQL(), `SELECT COUNT(*) FROM table`)

	qb.AddWhere("id = ?", "foo")
	assertSQL(t, qb.ToSQL(), `SELECT * FROM table WHERE id = $1`)
	assertSQL(t, qb.ToCountSQL(), `SELECT COUNT(*) FROM table WHERE id = $1`)

	qb.Paginate(1, 10)
	assertSQL(t, qb.ToSQL(), `SELECT * FROM table WHERE id = $1 LIMIT 10 OFFSET 0`)
	assertSQL(t, qb.ToCountSQL(), `SELECT COUNT(*) FROM table WHERE id = $1`)

	qb.AddWhere("id = ?", 10)
	qb.AddWhere("name = ?", "foo")
	qb.AddWhere("user_id LIKE ?", "foo%")
	assertSQL(t, qb.ToSQL(), `SELECT * FROM table WHERE id = $1 AND id = $2 AND name = $3 AND user_id LIKE $4 LIMIT 10 OFFSET 0`)

	qb.AddJoin("JOIN other_table ON (table.ot_id = other_table.id)")
	assertSQL(t, qb.ToSQL(), `SELECT * FROM table JOIN other_table ON (table.ot_id = other_table.id) WHERE id = $1 AND id = $2 AND name = $3 AND user_id LIKE $4 LIMIT 10 OFFSET 0`)
	assertSQL(t, qb.ToCountSQL(), `SELECT COUNT(*) FROM table JOIN other_table ON (table.ot_id = other_table.id) WHERE id = $1 AND id = $2 AND name = $3 AND user_id LIKE $4`)
}

func assertSQL(t *testing.T, query, expected string) {
	if query != expected {
		t.Fatalf("invalid SQL query, expected: `%s` but got: `%s`", expected, query)
	}
}
