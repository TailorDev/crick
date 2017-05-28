package models

import (
	"crypto/rand"
	"encoding/base64"

	"github.com/jmoiron/sqlx"
	"github.com/satori/go.uuid"
)

var (
	createUser = `INSERT INTO users (id, login, auth0_id, watson_token) VALUES (:id, :login, :auth0_id, :watson_token) ON CONFLICT DO NOTHING;`
)

type User struct {
	ID          uuid.UUID `db:"id" json:"id"`
	Auth0ID     string    `db:"auth0_id" json:"auth0_id"`
	Login       string    `db:"login" json:"login"`
	WatsonToken string    `db:"watson_token" json:"token"`
}

func NewUser(auth0, login string) *User {
	token, _ := generateRandomString(40)

	return &User{
		ID:          uuid.NewV4(),
		Auth0ID:     auth0,
		Login:       login,
		WatsonToken: token,
	}
}

func CreateNewUser(db *sqlx.DB, auth0ID, login string) (*User, error) {
	u := NewUser(auth0ID, login)
	if _, err := db.NamedExec(createUser, u); err != nil {
		return nil, err
	}

	return u, nil
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
