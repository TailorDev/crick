// Package main contains the Crick API application.
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/NYTimes/gziphandler"
	"github.com/TailorDev/crick/api/config"
	"github.com/TailorDev/crick/api/handlers"
	m "github.com/TailorDev/crick/api/middleware"
	"github.com/TailorDev/crick/api/models"
	"github.com/coreos/go-systemd/activation"
	"github.com/jmoiron/sqlx"
	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"go.uber.org/zap"
)

// App is the application kernel.
func App(repository models.Repository, logger *zap.Logger) *httprouter.Router {
	router := httprouter.New()
	h := handlers.New(repository, logger)

	// users
	router.GET("/users/me", m.AuthWithAuth0(h.UsersGetMe, repository, logger))
	router.GET("/users", m.AuthWithAuth0(h.GetUsers, repository, logger))

	// projects
	router.GET("/projects", m.AuthWithAuth0(h.GetProjects, repository, logger))
	router.GET("/projects/:id/workloads", m.AuthWithAuth0(h.GetProjectWorkloads, repository, logger))

	// frames
	router.GET("/frames", m.AuthWithAuth0(h.GetFrames, repository, logger))

	// teams
	router.GET("/teams", m.AuthWithAuth0(h.GetTeams, repository, logger))
	router.POST("/teams", m.AuthWithAuth0(h.CreateTeam, repository, logger))
	router.PUT("/teams/:id", m.AuthWithAuth0(h.UpdateTeam, repository, logger))
	router.DELETE("/teams/:id", m.AuthWithAuth0(h.DeleteTeam, repository, logger))

	// Watson API
	router.GET("/watson/projects", m.AuthWithToken(h.GetProjects, repository, logger))
	router.GET("/watson/frames", m.AuthWithToken(h.GetFramesSince, repository, logger))
	router.POST("/watson/frames/bulk", m.AuthWithToken(h.BulkInsertFrames, repository, logger))

	return router
}

// applyGlobalMiddleware applies the common middleware to the whole app
func applyGlobalMiddleware(app http.Handler) http.Handler {
	cors := cors.New(cors.Options{
		AllowedOrigins: config.CorsAllowedOrigins(),
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Authorization", "Accept", "Content-Type"},
	})

	return alice.New(
		cors.Handler,
		gziphandler.GzipHandler,
	).Then(app)
}

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	db, err := sqlx.Open("postgres", config.DSN())
	if err != nil {
		logger.Fatal("could not connect to database", zap.Error(err))
	}
	defer db.Close()

	app := App(models.NewDatabaseRepository(db), logger)
	handler := applyGlobalMiddleware(app)

	if port := config.Port(); port != "" {
		// create a socket and listen to it
		log.Fatal(http.ListenAndServe(
			fmt.Sprintf(":%s", config.Port()),
			handler,
		))
	} else {
		// try to get a socket from systemd
		listeners, err := activation.Listeners(true)
		if err != nil {
			logger.Fatal("failed to get a socket", zap.Error(err))
		}

		if len(listeners) != 1 {
			logger.Fatal("Unexpected number of socket activation fds")
		}

		log.Fatal(http.Serve(listeners[0], handler))
	}
}
