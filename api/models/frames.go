package models

import (
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	uuid "github.com/satori/go.uuid"
)

var (
	createFrame = `INSERT INTO frames (id, start_at, end_at, project_id, tags, synchronized_at)
				   VALUES (:id, :start_at, :end_at, :project_id, :tags, NOW());`
	selectFramesByUserID = `SELECT frames.*, projects.name AS project_name FROM frames
							INNER JOIN projects ON (frames.project_id = projects.id)
							WHERE projects.user_id=$1;`
	selectFramesByUserIDAndDate = `SELECT frames.*, projects.name AS project_name FROM frames
								   INNER JOIN projects ON (frames.project_id = projects.id)
								   WHERE projects.user_id=$1
								   AND frames.synchronized_at >= $2;`
)

type Frame struct {
	ID             string         `db:"id" json:"id"`
	StartAt        time.Time      `db:"start_at" json:"start_at"`
	EndAt          time.Time      `db:"end_at" json:"end_at"`
	ProjectID      uuid.UUID      `db:"project_id" json:"-"`
	SynchronizedAt time.Time      `db:"synchronized_at" json:"-"`
	ProjectName    string         `db:"project_name" json:"project"`
	Tags           pq.StringArray `db:"tags" json:"tags"`
}

func GetFrames(db *sqlx.DB, userID uuid.UUID) ([]Frame, error) {
	frames := []Frame{}
	if err := db.Select(&frames, selectFramesByUserID, userID); err != nil {
		return nil, err
	}

	return frames, nil
}

func GetFramesSince(db *sqlx.DB, userID uuid.UUID, date time.Time) ([]Frame, error) {
	frames := []Frame{}
	if err := db.Select(&frames, selectFramesByUserIDAndDate, userID, date); err != nil {
		return nil, err
	}

	return frames, nil
}

func CreateNewFrame(db *sqlx.DB, frame Frame) (Frame, error) {
	_, err := db.NamedExec(createFrame, frame)

	return frame, err
}
