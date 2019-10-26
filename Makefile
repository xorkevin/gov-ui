# CMD
BIN_DIR=bin

.PHONY: all clean-bin clean format dev build start serve publish

all: build

clean-bin:
	if [ -d $(BIN_DIR) ]; then rm -r $(BIN_DIR); fi

clean:
	rm -rf dist/

format:
	npx prettier --write --arrow-parens always --single-quote --trailing-comma all --no-bracket-spacing "src/**/*.js"
	npx prettier --write --arrow-parens always --single-quote --trailing-comma all --no-bracket-spacing "src/**/*.scss"

dev:
	npm run build-dev

build: clean
	npm run build

start:
	node server/server.js

serve: build start

publish: build
	npm publish

## docker
DOCKER_IMAGE_NAME=govui
DOCKER_VERSION=v0.3.3
DOCKER_FILE=./Dockerfile
.PHONY: build-docker produp proddown
build-docker:
	docker build -f $(DOCKER_FILE) -t $(DOCKER_IMAGE_NAME):$(DOCKER_VERSION) -t $(DOCKER_IMAGE_NAME):latest .

produp:
	docker-compose -f dc.main.yaml -f dc.compose.yaml up -d

proddown:
	docker-compose -f dc.main.yaml -f dc.compose.yaml down

## service
SERVICE_STACK=govui
SERVICE_DEF_DIR=defs
SERVICE_DEF_NAME=$(SERVICE_DEF_DIR)/dc.$(SERVICE_STACK).yaml
.PHONY: service launch danger-land
service:
	./servicedef-gen.sh $(SERVICE_DEF_DIR) $(SERVICE_DEF_NAME)

launch:
	docker stack deploy -c defs/dc.nuke.yaml $(SERVICE_STACK)

danger-land:
	docker stack rm $(SERVICE_STACK)
