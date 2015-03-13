export ENV=test
export PATH :=./node_modules/.bin/:$(PATH)

.PHONY: test create-test-db

test:
	mocha --recursive -R spec

create-test-db:
	psql template1 -c 'DROP DATABASE IF EXISTS simple_pg_db_test;'
	createdb simple_pg_db_test
	psql simple_pg_db_test -c 'CREATE TABLE simple_pg (id serial, name text not null);'

dev-env:
	docker run --name simple-pg-db-postgres -p 5432:5432 -e POSTGRES_PASSWORD=simple -d postgres

stop-dev-env:
	docker rm -vf simple-pg-db-postgres
