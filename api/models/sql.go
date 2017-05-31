package models

import (
	"fmt"
	"strings"
)

type QueryBuilder struct {
	Select []string
	From   []string
	Where  []string
	Join   []string
	Offset int
	Limit  int
	Values []interface{}
}

func NewQueryBuilder() QueryBuilder {
	return QueryBuilder{
		Select: []string{},
		From:   []string{},
		Where:  []string{},
		Join:   []string{},
		Values: []interface{}{},
		Limit:  0,
		Offset: 0,
	}
}

func (q *QueryBuilder) AddSelect(clause string) {
	q.Select = append(q.Select, clause)
}

func (q *QueryBuilder) AddFrom(clause string) {
	q.From = append(q.From, clause)
}

func (q *QueryBuilder) AddWhere(clause string, val interface{}) {
	q.Where = append(q.Where, clause)
	q.Values = append(q.Values, val)
}

func (q *QueryBuilder) AddJoin(clause string) {
	q.Join = append(q.Join, clause)
}

func (q *QueryBuilder) Paginate(page, limit int) {
	q.Offset = (page - 1) * limit
	q.Limit = limit
}

func (q *QueryBuilder) ToSQL() string {
	sql := fmt.Sprintf(
		"SELECT %s FROM %s",
		strings.Join(q.Select, ", "),
		strings.Join(q.From, ", "),
	)

	if len(q.Join) > 0 {
		sql = fmt.Sprintf("%s %s", sql, strings.Join(q.Join, " "))
	}

	if len(q.Where) > 0 {
		where := []string{}
		for k, clause := range q.Where {
			where = append(where, strings.Replace(clause, "?", fmt.Sprintf("$%d", (k+1)), 1))
		}

		sql = fmt.Sprintf("%s WHERE %s", sql, strings.Join(where, " AND "))
	}

	if q.Limit > 0 && q.Offset > 0 {
		sql = fmt.Sprintf("%s LIMIT %d OFFSET %d", q.Limit, q.Offset)
	}

	return sql
}

func (q *QueryBuilder) ToCountSQL() string {
	sql := fmt.Sprintf(
		"SELECT COUNT(frames.*) FROM %s",
		strings.Join(q.From, ", "),
	)

	if len(q.Join) > 0 {
		sql = fmt.Sprintf("%s %s", sql, strings.Join(q.Join, " "))
	}

	if len(q.Where) > 0 {
		where := []string{}
		for k, clause := range q.Where {
			where = append(where, strings.Replace(clause, "?", fmt.Sprintf("$%d", (k+1)), 1))
		}

		sql = fmt.Sprintf("%s WHERE %s", sql, strings.Join(where, " AND "))
	}

	return sql
}
