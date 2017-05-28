package middlewares

import (
	"context"

	"github.com/TailorDev/crick/api/models"
)

type contextKey string

func (c contextKey) String() string {
	return "io.crick.api.middlewares" + string(c)
}

var (
	contextCurrentUser = contextKey("current_user")
)

// GetCurrentUser returns the current logged user from the Context.
func GetCurrentUser(ctx context.Context) *models.User {
	return ctx.Value(contextCurrentUser).(*models.User)
}
