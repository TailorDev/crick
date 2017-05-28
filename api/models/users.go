package models

import (
	"crypto/rand"
	"encoding/base64"

	"github.com/satori/go.uuid"
)

var (
	selectUserByID    = `SELECT * FROM users WHERE auth0_id=$1;`
	selectUserByToken = `SELECT * FROM users WHERE api_token=$1;`
	createUser        = `INSERT INTO users (id, login, auth0_id, api_token) VALUES (:id, :login, :auth0_id, :api_token) ON CONFLICT DO NOTHING;`
)

type User struct {
	ID       uuid.UUID `db:"id" json:"id"`
	Auth0ID  string    `db:"auth0_id" json:"auth0_id"`
	Login    string    `db:"login" json:"login"`
	ApiToken string    `db:"api_token" json:"token"`
}

func NewUser(auth0, login string) *User {
	token, _ := generateRandomString(40)

	return &User{
		ID:       uuid.NewV4(),
		Auth0ID:  auth0,
		Login:    login,
		ApiToken: token,
	}
}

func (r DatabaseRepository) CreateNewUser(auth0ID, login string) (*User, error) {
	u := NewUser(auth0ID, login)
	_, err := r.db.NamedExec(createUser, u)

	return u, err
}

func (r DatabaseRepository) GetUserByAuth0ID(auth0ID string) (*User, error) {
	u := &User{}
	err := r.db.Get(u, selectUserByID, auth0ID)

	return u, err
}

func (r DatabaseRepository) GetUserByToken(token string) (*User, error) {
	u := &User{}
	err := r.db.Get(u, selectUserByToken, token)

	return u, err
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
