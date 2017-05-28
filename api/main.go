package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/TailorDev/crick/api/config"
	"github.com/TailorDev/crick/api/handlers"
	m "github.com/TailorDev/crick/api/middlewares"
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
	router.GET("/users/me", m.AuthWithAuth0(h.UsersGetMe, db, logger))
	router.GET("/projects", m.AuthWithAuth0(h.GetProjects, db, logger))
	router.GET("/projects/:id/frames", m.AuthWithAuth0(h.GetFramesForProject, db, logger))
	// Watson API
	router.GET("/api/projects", m.AuthWithToken(h.GetProjects, db))
	router.GET("/api/frames", m.AuthWithToken(h.GetFrames, db))
	router.POST("/api/frames/bulk", m.AuthWithToken(h.BulkInsertFrames, db))

	return router
}

// applyGlobalMiddlewares applies the common middlewares to the whole app
func applyGlobalMiddlewares(app http.Handler) http.Handler {
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
		applyGlobalMiddlewares(app),
	))
}
