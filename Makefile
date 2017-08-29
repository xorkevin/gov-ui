BIN_DIR=bin

all: build

clean:
	if [ -d $(BIN_DIR) ]; then rm -r $(BIN_DIR); fi

dev:
	npm run build-dev

build:
	npm run build
