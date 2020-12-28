## PROLOG

.PHONY: help all

CMDNAME=gov-ui
CMDDESC=governor frontend toolkit

help: ## Print this help
	@./help.sh '$(CMDNAME)' '$(CMDDESC)'

all: lint ## Default

## FMT

.PHONY: lint publish

lint: ## Run linter
	npm run lint

## PUBLISH

publish: lint ## Publish npm package
	npm publish
