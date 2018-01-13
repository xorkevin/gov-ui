# METADATA
VERSION=v0.1.0

# CMD
BIN_DIR=bin
BIN_ADMIN_DIR=bin_admin
SERVER_DIR=bin_server

# DOCKER
IMAGE_NAME=nuke

all: build build-admin build-server

clean-bin:
	if [ -d $(BIN_DIR) ]; then rm -r $(BIN_DIR); fi

clean-bin-admin:
	if [ -d $(BIN_ADMIN_DIR) ]; then rm -r $(BIN_ADMIN_DIR); fi

clean-binserver:
	if [ -d $(SERVER_DIR) ]; then rm -r $(SERVER_DIR); fi

clean: clean-bin clean-bin-admin clean-binserver

dev:
	BABEL_ENV=dev npm run build-dev

dev-admin:
	BABEL_ENV=dev npm run build-admin-dev

build: clean-bin
	BABEL_ENV=web npm run build

build-admin: clean-bin-admin
	BABEL_ENV=web npm run build-admin

build-server: clean-binserver
	BABEL_ENV=server npm run build-server

start:
	npm run serve

start-admin:
	NUKE_MODE=admin npm run serve

serve: build build-server start

serve-admin: build-admin build-server start-admin

## docker
build-docker:
	docker build -f ./Dockerfile -t $(IMAGE_NAME):$(VERSION) -t $(IMAGE_NAME):latest .

produp:
	docker-compose -f docker-compose.yaml up -d

proddown:
	docker-compose -f docker-compose.yaml down
