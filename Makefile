BIN_DIR=bin
SERVER_DIR=bin_server

all: build

clean:
	if [ -d $(BIN_DIR) ]; then rm -r $(BIN_DIR); fi
	if [ -d $(SERVER_DIR) ]; then rm -r $(SERVER_DIR); fi

dev:
	npm run build-dev

build:
	npm run build

build-server:
	npm run build-server

start:
	npm run serve

serve: build build-server start
