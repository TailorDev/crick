package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/TailorDev/crick/api/config"
	"github.com/TailorDev/crick/api/handlers"
	"github.com/TailorDev/crick/api/middlewares"
	"github.com/jmoiron/sqlx"
	"github.com/julienschmidt/httprouter"
	_ "github.com/lib/pq"
	"go.uber.org/zap"
)

// App is the application kernel.
func App(db *sqlx.DB) *httprouter.Router {
	router := httprouter.New()
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	h := handlers.New(db, logger)
	router.GET("/users/me", middlewares.Auth(h.UsersGetMe, logger))

	return router
}

// applyMiddlewares applies the common middlewares to the whole app
func applyMiddlewares(app http.Handler) http.Handler {
	return app
}

func main() {
	db, err := sqlx.Open("postgres", config.DSN())
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
