export ENV=test
export PATH :=./node_modules/.bin/:$(PATH)

.PHONY: test create-test-db

test: create-test-db
	mocha --recursive

create-test-db:
	psql template1 -c 'DROP DATABASE IF EXISTS simple_pg_db_test;'
	createdb simple_pg_db_test
	psql simple_pg_db_test -c 'CREATE TABLE simple_pg (id serial, name text not null);'
