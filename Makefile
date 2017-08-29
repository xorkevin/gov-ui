BIN_DIR=bin
BUILD_DIR=build_server

all: build

clean:
	if [ -d $(BIN_DIR) ]; then rm -r $(BIN_DIR); fi
	if [ -d $(BUILD_DIR) ]; then rm -r $(BUILD_DIR); fi

dev:
	npm run build-dev

build:
	npm run build

serve:
	npm run build-server
	npm run serve
