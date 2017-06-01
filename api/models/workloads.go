package models

import (
	"time"

	uuid "github.com/satori/go.uuid"
)

// Workload is a structure representing a worload by day. A workload follows a
// scale from 1 to 4, and gives an indication on how much work has been done
// that day (on a specific task).
type Workload struct {
	Date     time.Time `db:"date" json:"date"`
	Workload int       `db:"workload" json:"workload"`
}

// Workloads is a set of workloads.
type Workloads []Workload

var (
	selectProjectWorkloads = `SELECT date,
	CASE WHEN nb_hours <= 1 THEN 1
		 WHEN (nb_hours > 1 AND nb_hours <= 4) THEN 2
		 WHEN (nb_hours > 4 AND nb_hours <= 6) THEN 3
		 ELSE 4
	END as workload
	FROM project_workloads
	WHERE user_id=$1 AND project_id=$2
	ORDER BY date DESC
	LIMIT 300;`
)

// GetProjectWorkloads returns a set of workloads for a given user and project.
func (r DatabaseRepository) GetProjectWorkloads(userID, projectID uuid.UUID) (*Workloads, error) {
	workloads := &Workloads{}
	err := r.db.Select(workloads, selectProjectWorkloads, userID, projectID)

	return workloads, err
}
