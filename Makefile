BIN_DIR=bin
BIN_ADMIN_DIR=bin_admin
SERVER_DIR=bin_server

all: build

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
	npm run serve-admin

serve: build build-server start

serve-admin: build-admin build-server start-admin
