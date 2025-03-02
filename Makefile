build:
	docker compose build

run: build
	docker compose up

down:
	docker compose down

.PHONY: build run down
