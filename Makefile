VERT="\\033[1;32m"
NORMAL="\\033[0;39m"
ROUGE="\\033[1;31m"
ROSE="\\033[1;35m"
BLEU="\\033[1;34m"
BLANC="\\033[0;02m"
BLANCLAIR="\\033[1;08m"
JAUNE="\\033[1;33m"
CYAN="\\033[1;36m"

export LS_COLORS='rs=0:di=01;34:ln=01;36:mh=00:pi=40;33'
export CLICOLOR=1

SYMFONY         = php bin/console
COMPOSER        = composer
YARN            = yarn

##
##================================================================
## Service Workers Symfony 4
##================================================================
##
##----------------------------------------------------------------
## Set up
##----------------------------------------------------------------

composer.lock: composer.json
	$(COMPOSER) update --lock --no-scripts --no-interaction -v

node_modules: ## Install node modules
node_modules: yarn.lock
	$(YARN) install
	@touch -c node_modules

vendor: ## Install the vendors
vendor: composer.lock
	$(COMPOSER) install -v

assets: ## Run Webpack Encore to compile assets
assets: node_modules
	@echo -n "Environment : [dev] " && read ans && [ -z $$ans ] && ans="dev"; \
	$(YARN) run encore $$ans

watch: ## Watch assets with Webpack Encore
	$(YARN) run encore dev --watch

cache: ## Clear the caches
	@echo -n "Environment : [dev] " && read ans && [ -z $$ans ] && ans="dev"; \
	$(SYMFONY) cache:clear -v --env=$$ans

install: ## Install (or refresh) the project
install: vendor assets htaccess

.PHONY: vendor node_modules assets cache hooks install

##
##----------------------------------------------------------------
## Database / Doctrine
##----------------------------------------------------------------

db-drop: ## Drop database
	@echo "This will erase all your data, are you sure you want to do this (y/n) ? [n]" && read ans && [ -z $$ans ] && ans="n"; \
	if [ $$ans = 'y' ] ; then $(SYMFONY) doctrine:database:drop --if-exists --force; fi; \

db-create: ## Create database
	$(SYMFONY) doctrine:database:create --if-not-exists

db-dump: ## Dumps the SQL needed to update the database schema to match the current mapping metadata
	$(SYMFONY) doctrine:schema:update --dump-sql

db-force: ## Executes the SQL needed to update the database schema to match the current mapping metadata
	$(SYMFONY) doctrine:schema:update --force

db-fixtures: ## Append the fixtures
	$(SYMFONY) doctrine:fixtures:load --append

db: ## Update SQL Schema
db: dump force

db-reset: ## Reset database
db-reset: drop create db fixtures

.PHONY: drop create dump force db fixtures reset

##
##----------------------------------------------------------------
## Quality assurance
##----------------------------------------------------------------

lint: ## Lints twig and yaml files
lint: lt ly

lt:
	$(SYMFONY) lint:twig app/Resources/views

ly:
	$(SYMFONY) lint:yaml app/config

phpcsfixer: ## Run the PHP Coding Standards fixer on dry-run mode
	php ./vendor/bin/php-cs-fixer fix --config=.php_cs --using-cache=no --verbose --dry-run

phpcsfixer-apply: ## Run the PHP Coding Standards fixer on apply mode
	php ./vendor/bin/php-cs-fixer fix --config=.php_cs --using-cache=no --verbose

phpstan: ## Run a PHPStan analysis at the strictest level
	php vendor/bin/phpstan analyse \
			--autoload-file=bin/.phpunit/phpunit-6.5/vendor/autoload.php \
			--level max src tests

security: ## Check security of your dependencies (https://security.sensiolabs.org/)
	php ./vendor/bin/security-checker security:check

quality: ## Check the project vulnerabilities & defects
quality: lint security

.PHONY: lint lt ly security push

# Help
.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' \
		| sed -e 's/\[32m##/[33m/'
.PHONY: help