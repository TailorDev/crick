package models

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"

	"github.com/satori/go.uuid"
)

var (
	selectUserByID = `SELECT * FROM users WHERE auth0_id=$1;`

	selectUserByToken = `SELECT * FROM users WHERE api_token=$1;`

	createUser = `INSERT INTO users (id, login, auth0_id, api_token, avatar_url)
	VALUES (:id, :login, :auth0_id, :api_token, :avatar_url)
	ON CONFLICT DO NOTHING;`

	selectUsersByLoginLike = `SELECT * FROM users WHERE login ILIKE $1 LIMIT $2;`
)

var (
	// LimitUsersToReturn is the default number of users to return.
	LimitUsersToReturn = 10
)

// User is a structure representing a Crick user.
type User struct {
	ID        uuid.UUID `db:"id" json:"id"`
	Auth0ID   string    `db:"auth0_id" json:"-"`
	Login     string    `db:"login" json:"login"`
	APIToken  string    `db:"api_token" json:"-"`
	AvatarURL string    `db:"avatar_url" json:"avatar_url"`
}

// Users is a structure representing a set of users. Its purpose is mainly to
// ease the JSON serialization (to return a root key).
type Users struct {
	Users []User `json:"users"`
}

// IsOwnerOfTeam returns true if the user is owner of the given team, false
// otherwise.
func (u *User) IsOwnerOfTeam(t Team) bool {
	return u.ID == t.OwnerID
}

// NewUser creates and returns a User instance. This function generates the
// initial user's API token.
func NewUser(auth0ID, login, avatarURL string) *User {
	token, _ := generateRandomString(40)

	return &User{
		ID:        uuid.NewV4(),
		Auth0ID:   auth0ID,
		Login:     login,
		APIToken:  token,
		AvatarURL: avatarURL,
	}
}

// NewUsers returns an instance of NewUsers.
func NewUsers() Users {
	return Users{
		Users: []User{},
	}
}

// CreateNewUser creates a new user, persists it and returns it.
func (r DatabaseRepository) CreateNewUser(auth0ID, login, avatarURL string) (*User, error) {
	u := NewUser(auth0ID, login, avatarURL)
	_, err := r.db.NamedExec(createUser, u)

	return u, err
}

// GetUserByAuth0ID returns a user corresponding to the given Auth0 id.
func (r DatabaseRepository) GetUserByAuth0ID(auth0ID string) (*User, error) {
	u := &User{}
	err := r.db.Get(u, selectUserByID, auth0ID)

	return u, err
}

// GetUserByToken returns a user corresponding to the given API token.
func (r DatabaseRepository) GetUserByToken(token string) (*User, error) {
	u := &User{}
	err := r.db.Get(u, selectUserByToken, token)

	return u, err
}

// GetUsersByLoginLike returns a set of users based on the given login, it is
// used for autocompletion for instance.
func (r DatabaseRepository) GetUsersByLoginLike(like string) (Users, error) {
	users := NewUsers()
	err := r.db.Select(&users.Users, selectUsersByLoginLike, fmt.Sprintf("%s%%", like), LimitUsersToReturn)

	return users, err
}

// cf. https://elithrar.github.io/article/generating-secure-random-numbers-crypto-rand/
func generateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	// Note that err == nil only if we read len(b) bytes.
	if err != nil {
		return nil, err
	}

	return b, nil
}

func generateRandomString(s int) (string, error) {
	b, err := generateRandomBytes(s)
	return base64.URLEncoding.EncodeToString(b), err
}
