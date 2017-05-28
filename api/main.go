package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/TailorDev/crick/api/config"
	"github.com/TailorDev/crick/api/handlers"
	m "github.com/TailorDev/crick/api/middlewares"
	"github.com/TailorDev/crick/api/models"
	"github.com/jmoiron/sqlx"
	"github.com/julienschmidt/httprouter"
	_ "github.com/lib/pq"
	"go.uber.org/zap"
)

// App is the application kernel.
func App(repository models.Repository, logger *zap.Logger) *httprouter.Router {
	router := httprouter.New()

	h := handlers.New(repository, logger)
	router.GET("/users/me", m.AuthWithAuth0(h.UsersGetMe, repository, logger))
	router.GET("/projects", m.AuthWithAuth0(h.GetProjects, repository, logger))
	router.GET("/projects/:id/frames", m.AuthWithAuth0(h.GetFramesForProject, repository, logger))
	// Watson API
	router.GET("/api/projects", m.AuthWithToken(h.GetProjects, repository))
	router.GET("/api/frames", m.AuthWithToken(h.GetFrames, repository))
	router.POST("/api/frames/bulk", m.AuthWithToken(h.BulkInsertFrames, repository))

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

	logger, _ := zap.NewProduction()
	defer logger.Sync()

	app := App(models.NewDatabaseRepository(db), logger)
	log.Fatal(http.ListenAndServe(
		fmt.Sprintf(":%s", config.Port()),
		applyGlobalMiddlewares(app),
	))
}
