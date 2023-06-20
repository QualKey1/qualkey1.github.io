.PHONY: help go go-prod build build-prod start start-prod stop restart restart-front restart-back restart-db shell shell-front shell-db shell-pg migrate dump test test-watch backup

DOCKER_COMPOSE=docker-compose
DOCKER_COMPOSE_RUN=$(DOCKER_COMPOSE) run --rm --no-deps
DOCKER_COMPOSE_RUN_WITH_DEPS=$(DOCKER_COMPOSE) run --rm
DOCKER_COMPOSE_DEV=$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml
DOCKER_COMPOSE_PROD=$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml

processing = qk_processing
db = qualkey_db
front = qk_front

dev_db_user = qualkey
dev_dv_volume = qk_pgdata
dev_db_dump = qk_db-dev.sql

COLOR_RESET   = \033[0m
COLOR_INFO    = \033[32m
COLOR_COMMENT = \033[33m

## Help
help:
	@printf "${COLOR_COMMENT}Usage:${COLOR_RESET}\n"
	@printf " make [target]\n\n"
	@printf "${COLOR_COMMENT}Available targets:${COLOR_RESET}\n"
	@awk '/^[a-zA-Z\-\0-9\.@]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf " ${COLOR_INFO}%-16s${COLOR_RESET} %s\n", helpCommand, helpMessage; \
		} \
	} \
{ lastLine = $$0 }' $(MAKEFILE_LIST)

## One command to setup and start the project
go: build start dump migrate

## One command to setup and start the project
go-prod: build-prod start-prod dump migrate

## Build project
build:
	$(DOCKER_COMPOSE_DEV) build

## Build project for prod
build-prod:
	$(DOCKER_COMPOSE_PROD) build

## Start project
start:
	$(DOCKER_COMPOSE_DEV) up -d --force-recreate

## Start project for prod
start-prod:
	$(DOCKER_COMPOSE_PROD) up -d --force-recreate

## Stop project
stop:
	$(DOCKER_COMPOSE_DEV) down

## Stop project for prod
stop-prod:
	$(DOCKER_COMPOSE_PROD) down

## Restart project
restart: stop start

## Restart front container
restart-front:
	$(DOCKER_COMPOSE_DEV) restart $(front)

## Restart processing container
restart-back:
	$(DOCKER_COMPOSE_DEV) restart $(processing)

## Restart db container
restart-db:
	$(DOCKER_COMPOSE_DEV) restart $(db)

## Open processing container command line
shell:
	docker exec -it $(processing) sh

## Open front container command line
shell-front:
	docker exec -it $(front) sh

## Open db container command line
shell-db:
	docker exec -it $(db) bash

## Open postgres cli in db container
shell-pg:
	docker exec -ti $(db) bash -c "psql -U $(dev_db_user)"

## Run migrations
migrate:
	docker exec -t $(processing) sh -c "npx prisma migrate dev"

## Make back-up
backup:
	docker exec $(db) pg_dump -U $(dev_db_user) -F t qualkey > db.docker/qk_db-dev.sql

## Restore admin database
dump:
	docker cp db.docker/$(dev_db_dump) $(db):/$(dev_dv_volume)
	cat db.docker/$(dev_db_dump) | docker exec -i $(db) psql -U $(dev_db_user)

## Apply changes from Prisma schema to DB
schema-push:
	docker exec -t $(processing) sh -c "npx prisma db push"

## Run tests
test:
	docker exec -it qk_processing sh -c "npm test --max-workers=1"

## Run tests in watch mode
test-watch:
	docker exec -it qk_processing sh -c "npm run test:watch"
