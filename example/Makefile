## PROLOG

.PHONY: help all

CMDNAME=gov-ui
CMDDESC=example project

help: ## Print this help
	@./help.sh '$(CMDNAME)' '$(CMDDESC)'

all: build ## Default

## FMT

.PHONY: fmt

fmt: ## Run formatter
	npx prettier --write --arrow-parens always --single-quote --trailing-comma all --no-bracket-spacing "src/**/*.js"
	npx prettier --write --arrow-parens always --single-quote --trailing-comma all --no-bracket-spacing "src/**/*.scss"

## APP DEPLOY

.PHONY: dev build

dev: ## Run local dev server
	npm run build-dev

build: ## Build project
	if [ -d bin ]; then rm -r bin; fi
	npm run build
