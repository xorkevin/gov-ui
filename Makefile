# METADATA
VERSION=v0.1.0

# CMD
BIN_DIR=bin
BIN_ADMIN_DIR=bin_admin

# DOCKER
IMAGE_NAME=nuke

.PHONY: all clean-bin clean-bin-admin clean format dev dev-admin build build-admin start start-admin serve serve-admin build-docker produp proddown

all: build build-admin

clean-bin:
	if [ -d $(BIN_DIR) ]; then rm -r $(BIN_DIR); fi

clean-bin-admin:
	if [ -d $(BIN_ADMIN_DIR) ]; then rm -r $(BIN_ADMIN_DIR); fi

clean: clean-bin clean-bin-admin

format:
	npx prettier --write --arrow-parens always --single-quote --trailing-comma all --no-bracket-spacing "src/**/*.js"

dev:
	BABEL_ENV=dev npm run build-dev

dev-admin:
	BABEL_ENV=dev npm run build-admin-dev

build: clean-bin
	BABEL_ENV=web npm run build

build-admin: clean-bin-admin
	BABEL_ENV=web npm run build-admin

start:
	npm run serve

start-admin:
	NUKE_MODE=admin npm run serve

serve: build start

serve-admin: build-admin start-admin

## gen
.PHONY: gen

gen:
	./servicedef-gen.sh

## docker
build-docker:
	docker build -f ./Dockerfile -t $(IMAGE_NAME):$(VERSION) -t $(IMAGE_NAME):latest .

produp:
	docker-compose -f dc.main.yaml -f dc.compose.yaml up -d

proddown:
	docker-compose -f dc.main.yaml -f dc.compose.yaml down

## service
SERVICE_STACK=nuke
.PHONY: launch danger-land
launch:
	docker stack deploy -c defs/dc.nuke.yaml $(SERVICE_STACK)

danger-land:
	docker stack rm $(SERVICE_STACK)
