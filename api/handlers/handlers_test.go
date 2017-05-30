package handlers_test

import (
	"context"
	"time"

	"github.com/TailorDev/crick/api/middlewares"
	"github.com/TailorDev/crick/api/models"
	uuid "github.com/satori/go.uuid"
)

func GetFakeUser() *models.User {
	return models.NewUser("auth0_id", "John Doe")
}

func AddUserToContext(c context.Context, u *models.User) context.Context {
	return context.WithValue(c, middlewares.ContextCurrentUser, u)
}

// MockRepository implements the models.Repository interface for unit testing
// purpose.
type MockRepository struct {
	User     *models.User
	Project  *models.Project
	Frames   []models.Frame
	Projects models.Projects
	Teams    models.Teams
	Err      error
}

func (r MockRepository) GetFrames(userID uuid.UUID) ([]models.Frame, error) {
	return r.Frames, r.Err
}

func (r MockRepository) GetFramesSince(userID uuid.UUID, date time.Time) ([]models.Frame, error) {
	return r.Frames, r.Err
}

func (r MockRepository) CreateNewFrame(frame models.Frame) error {
	return r.Err
}

func (r MockRepository) GetFramesForProject(userID, projectID uuid.UUID) ([]models.Frame, error) {
	return r.Frames, r.Err
}

func (r MockRepository) CreateNewProject(name string, userID uuid.UUID) (*models.Project, error) {
	return r.Project, r.Err
}

func (r MockRepository) GetProjects(userID uuid.UUID) (models.Projects, error) {
	return r.Projects, r.Err
}

func (r MockRepository) GetProjectByName(userID uuid.UUID, name string) (*models.Project, error) {
	return r.Project, r.Err
}

func (r MockRepository) CreateNewUser(auth0ID, login string) (*models.User, error) {
	return r.User, r.Err
}

func (r MockRepository) GetUserByAuth0ID(auth0ID string) (*models.User, error) {
	return r.User, r.Err
}

func (r MockRepository) GetUserByToken(token string) (*models.User, error) {
	return r.User, r.Err
}

func (r MockRepository) GetTeamsWithUsers(userID uuid.UUID) (models.Teams, error) {
	return r.Teams, r.Err
}

func (r MockRepository) CreateNewTeam(team models.Team) error {
	return r.Err
}
