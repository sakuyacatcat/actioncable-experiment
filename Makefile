build:
	docker compose build

build-prod:
	docker compose -f compose.prod.yml build

run: build
	docker compose up

run-prod: build-prod
	docker compose -f compose.prod.yml up

down:
	docker compose down

down-prod:
	docker compose -f compose.prod.yml down

.PHONY: build build-prod run run-prod down down-prod
