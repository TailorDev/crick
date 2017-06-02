package models

import (
	"time"

	"github.com/lib/pq"
	uuid "github.com/satori/go.uuid"
)

var (
	createFrame = `INSERT INTO frames (id, start_at, end_at, project_id, tags, synchronized_at)
	VALUES (:id, :start_at, :end_at, :project_id, :tags, NOW())
	ON CONFLICT DO NOTHING;`

	selectFramesByUserID = `SELECT frames.*, projects.name AS project_name FROM frames
	INNER JOIN projects ON (frames.project_id = projects.id)
	WHERE projects.user_id=$1;`

	selectFramesByUserIDAndDate = `SELECT frames.*, projects.name AS project_name FROM frames
	INNER JOIN projects ON (frames.project_id = projects.id)
	WHERE projects.user_id=$1 AND frames.synchronized_at >= $2;`
)

// Frame is a data structure for representing time frames.
type Frame struct {
	ID             uuid.UUID      `db:"id" json:"id"`
	StartAt        time.Time      `db:"start_at" json:"start_at"`
	EndAt          time.Time      `db:"end_at" json:"end_at"`
	ProjectID      uuid.UUID      `db:"project_id" json:"-"`
	SynchronizedAt time.Time      `db:"synchronized_at" json:"-"`
	ProjectName    string         `db:"project_name" json:"project"`
	Tags           pq.StringArray `db:"tags" json:"tags"`
}

// GetFrames returns all the user's frames.
func (r DatabaseRepository) GetFrames(userID uuid.UUID) ([]Frame, error) {
	frames := []Frame{}
	err := r.db.Select(&frames, selectFramesByUserID, userID)

	return frames, err
}

// GetFramesSince returns the user's fraces since date.
func (r DatabaseRepository) GetFramesSince(userID uuid.UUID, date time.Time) ([]Frame, error) {
	frames := []Frame{}
	err := r.db.Select(&frames, selectFramesByUserIDAndDate, userID, date)

	return frames, err
}

// CreateNewFrame creates a new frame and persists it.
func (r DatabaseRepository) CreateNewFrame(frame Frame) error {
	_, err := r.db.NamedExec(createFrame, frame)

	return err
}

// GetFramesWithQueryBuilder returns the frames matching the query from the
// QueryBuilder. It returns the number of results as first return value, then
// the result set paginated.
func (r DatabaseRepository) GetFramesWithQueryBuilder(qb QueryBuilder) (int, []Frame, error) {
	count := 0
	frames := []Frame{}

	countQuery := qb.ToCountSQL()
	selectQuery := qb.ToSQL()

	err := r.db.Get(&count, countQuery, qb.Values()...)
	if err != nil {
		return count, frames, err
	}

	err = r.db.Select(&frames, selectQuery, qb.Values()...)

	return count, frames, err
}
