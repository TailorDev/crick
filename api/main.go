package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/TailorDev/crick/api/config"
	"github.com/julienschmidt/httprouter"
	_ "github.com/lib/pq"
	"go.uber.org/zap"
)

// Handler is the structure that contains the different HTTP handlers.
type Handler struct {
	db     *sql.DB
	logger *zap.Logger
}

// App is the application kernel.
func App(db *sql.DB) *httprouter.Router {
	router := httprouter.New()
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	h := Handler{
		db:     db,
		logger: logger,
	}

	router.GET("/users/me", h.UsersGetMe)

	return router
}

func applyMiddlewares(app http.Handler) http.Handler {
	return app
}

func main() {
	db, err := sql.Open("postgres", config.DSN())
	if err != nil {
		log.Fatal(fmt.Sprintf("Could not connect to database: %v", err))
	}
	defer db.Close()

	app := App(db)
	log.Fatal(http.ListenAndServe(
		fmt.Sprintf(":%s", config.Port()),
		applyMiddlewares(app),
	))
}
