package models

import (
	"fmt"
	"strings"
)

// QueryBuilder represents a SQL query that is built by calling functions to
// it.
type QueryBuilder struct {
	selects []string
	froms   []string
	wheres  []string
	joins   []string
	offset  int
	limit   int
	values  []interface{}
	orderBy string
}

// NewQueryBuilder returns a new QueryBuilder.
func NewQueryBuilder() QueryBuilder {
	return QueryBuilder{
		selects: []string{},
		froms:   []string{},
		wheres:  []string{},
		joins:   []string{},
		values:  []interface{}{},
		limit:   0,
		offset:  0,
		orderBy: "",
	}
}

// AddSelect adds a SELECT clause to the query.
func (q *QueryBuilder) AddSelect(clause string) *QueryBuilder {
	q.selects = append(q.selects, clause)
	return q
}

// AddFrom adds a FROM clause to the query.
func (q *QueryBuilder) AddFrom(clause string) *QueryBuilder {
	q.froms = append(q.froms, clause)
	return q
}

// AddWhere adds a WHERE clause to the query.
func (q *QueryBuilder) AddWhere(clause string, val interface{}) *QueryBuilder {
	q.wheres = append(q.wheres, clause)
	q.values = append(q.values, val)
	return q
}

// AddJoin adds a JOIN clause to the query.
func (q *QueryBuilder) AddJoin(clause string) *QueryBuilder {
	q.joins = append(q.joins, clause)
	return q
}

// Paginate adds limit and offset to the query.
func (q *QueryBuilder) Paginate(page, limit int) *QueryBuilder {
	q.offset = (page - 1) * limit
	q.limit = limit
	return q
}

// OrderBy adds the ORDER BY clause to the query.
func (q *QueryBuilder) OrderBy(clause string) *QueryBuilder {
	q.orderBy = clause
	return q
}

// Values returns the parameter values of the query.
func (q *QueryBuilder) Values() []interface{} {
	return q.values
}

// ToSQL returns the resulting SQL query as a string.
func (q *QueryBuilder) ToSQL() string {
	sql := fmt.Sprintf(
		"SELECT %s FROM %s",
		strings.Join(q.selects, ", "),
		strings.Join(q.froms, ", "),
	)

	if len(q.joins) > 0 {
		sql = fmt.Sprintf("%s %s", sql, strings.Join(q.joins, " "))
	}

	if len(q.wheres) > 0 {
		where := []string{}
		for k, clause := range q.wheres {
			where = append(where, strings.Replace(clause, "?", fmt.Sprintf("$%d", (k+1)), 1))
		}

		sql = fmt.Sprintf("%s WHERE %s", sql, strings.Join(where, " AND "))
	}

	if q.orderBy != "" {
		sql = fmt.Sprintf("%s ORDER BY %s", sql, q.orderBy)
	}

	if q.limit > 0 && q.offset >= 0 {
		sql = fmt.Sprintf("%s LIMIT %d OFFSET %d", sql, q.limit, q.offset)
	}

	return sql
}

// ToCountSQL returns the COUNT SQL query as a string, which does not contain
// any LIMIT/OFFSET, and the SELECT clause is `COUNT(*)`. This is useful to
// retrieve the number of results of a given query.
func (q *QueryBuilder) ToCountSQL() string {
	sql := fmt.Sprintf(
		"SELECT COUNT(*) FROM %s",
		strings.Join(q.froms, ", "),
	)

	if len(q.joins) > 0 {
		sql = fmt.Sprintf("%s %s", sql, strings.Join(q.joins, " "))
	}

	if len(q.wheres) > 0 {
		where := []string{}
		for k, clause := range q.wheres {
			where = append(where, strings.Replace(clause, "?", fmt.Sprintf("$%d", (k+1)), 1))
		}

		sql = fmt.Sprintf("%s WHERE %s", sql, strings.Join(where, " AND "))
	}

	return sql
}
