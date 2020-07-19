.PHONY: all format dev build

all: build

format:
	npx prettier --write --arrow-parens always --single-quote --trailing-comma all --no-bracket-spacing "src/**/*.js"
	npx prettier --write --arrow-parens always --single-quote --trailing-comma all --no-bracket-spacing "src/**/*.scss"

dev:
	npm run build-dev

build:
	if [ -d bin ]; then rm -r bin; fi
	npm run build
