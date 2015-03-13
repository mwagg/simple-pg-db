export ENV=test
export PATH :=./node_modules/.bin/:$(PATH)

.PHONY: test create-test-db

test:
	mocha --recursive -R spec

dev-env:
	docker run --name simple-pg-db-postgres -p 5432:5432 -e POSTGRES_PASSWORD=simple -d postgres

stop-dev-env:
	docker rm -vf simple-pg-db-postgres
