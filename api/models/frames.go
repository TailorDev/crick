package models

import (
	"time"

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
	WHERE projects.user_id=$1 AND frames.synchronized_at >= $2;`

	selectFramesByUserAndProjectIDs = `SELECT frames.*, projects.name AS project_name FROM frames
	INNER JOIN projects ON (frames.project_id = projects.id)
	WHERE projects.user_id=$1 AND frames.project_id=$2;`
)

type Frame struct {
	ID             uuid.UUID      `db:"id" json:"id"`
	StartAt        time.Time      `db:"start_at" json:"start_at"`
	EndAt          time.Time      `db:"end_at" json:"end_at"`
	ProjectID      uuid.UUID      `db:"project_id" json:"-"`
	SynchronizedAt time.Time      `db:"synchronized_at" json:"-"`
	ProjectName    string         `db:"project_name" json:"project"`
	Tags           pq.StringArray `db:"tags" json:"tags"`
}

func (r DatabaseRepository) GetFrames(userID uuid.UUID) ([]Frame, error) {
	frames := []Frame{}
	err := r.db.Select(&frames, selectFramesByUserID, userID)

	return frames, err
}

func (r DatabaseRepository) GetFramesSince(userID uuid.UUID, date time.Time) ([]Frame, error) {
	frames := []Frame{}
	err := r.db.Select(&frames, selectFramesByUserIDAndDate, userID, date)

	return frames, err
}

func (r DatabaseRepository) CreateNewFrame(frame Frame) error {
	_, err := r.db.NamedExec(createFrame, frame)

	return err
}

func (r DatabaseRepository) GetFramesForProject(userID, projectID uuid.UUID) ([]Frame, error) {
	frames := []Frame{}
	err := r.db.Select(&frames, selectFramesByUserAndProjectIDs, userID, projectID)

	return frames, err
}
