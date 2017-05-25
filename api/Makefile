RUN_MIGRATE=docker-compose -p crick -f docker-compose.yml -f docker-compose.tools.yml run --rm migrate

default: help

dev: ## start the API with Docker
	@docker-compose -p crick up -d
	@echo "\033[92mYou can browse the application at: http://127.0.0.1:8000\033[0m"
.PHONY: dev

migrate-up: ## apply database migrations
	$(RUN_MIGRATE) up
.PHONY: migrate-up

migrate-version: ## show database migration version
	$(RUN_MIGRATE) version
.PHONY: migrate-version

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.PHONY: help
