# CMD
BIN_DIR=bin

# DOCKER
IMAGE_NAME=gov-ui

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
	npm run serve

serve: build start

publish: build
	npm publish

## gen
.PHONY: gen

gen:
	./servicedef-gen.sh

.PHONY: build-docker produp proddown

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
