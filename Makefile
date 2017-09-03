BIN_DIR=bin
SERVER_DIR=bin_server

all: build

clean-bin:
	if [ -d $(BIN_DIR) ]; then rm -r $(BIN_DIR); fi

clean-binserver:
	if [ -d $(SERVER_DIR) ]; then rm -r $(SERVER_DIR); fi

clean: clean-bin clean-binserver

dev:
	npm run build-dev

build: clean-bin
	npm run build

build-server: clean-binserver
	npm run build-server

start:
	npm run serve

serve: build build-server start
