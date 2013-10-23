var simplePgDb = require('../index');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var Q = require('q');

var TEST_DB_NAME = "simple_pg_db_test";

chai.use(chaiAsPromised);

describe('simple-pg-db', function () {
  it('accepts an object with the parameters to compose a connection string', function () {
    expect(function () {
      simplePgDb({ host: 'localhost', port: 5432, dbname: TEST_DB_NAME });
    }).to.not.throw();
  });

  describe('query', function () {
    var db;
    var queryResult;

    before(function (done) {
      db = simplePgDb({ host: 'localhost', port: 5432, dbname: TEST_DB_NAME });
      expect(
        db.query("INSERT INTO simple_pg (name) VALUES ('test-1'); INSERT INTO simple_pg (name) VALUES ('test-2');"))
        .to.be.fulfilled.and.notify(done);
    });

    describe('for simple queries', function () {
      var query;

      before(function () {
        query = db.query('SELECT id, name FROM simple_pg ORDER BY name;');
      });

      it('resolves its promise', function (done) {
        expect(query).to.be.fulfilled.and.notify(done);
      });

      it('returns the row count', function (done) {
        expect(query).to.eventually.have.property('rowCount', 2).and.notify(done);
      });

      it('returns the results', function (done) {
        expect(
          query.then(function (result) {
            expect(result.rows).to.deep.equal([ { id: 1, name: 'test-1' }, { id: 2, name: 'test-2' }]);
        })).and.notify(done);
      });
    });

    it('allows queries with parameters', function (done) {
      var query = db.query('SELECT id, name FROM simple_pg WHERE name = $1;', ['test-2']);

      expect(query.then(function (r) { return r.rows; }))
        .to.eventually.deep.equal([{ id: 2, name: 'test-2'}])
        .and.notify(done);
    });

    describe('when there is an during a query', function () {
      var query;

      before(function () {
        query = db.query('INSERT INTO simple_pg (name) VALUES (null);');
      });

      it('rejects its promise', function (done) {
        expect(query).to.be.rejected
          .with(Error, 'null value in column "name" violates not-null constraint')
          .and.notify(done);
      });
    });

    it('can handle lots of concurrent queries', function (done) {
      var queries = [];
      for (var i = 0; i < 20; i++) {
        queries.push(db.query("SELECT id, name FROM simple_pg;"));
      }

      expect(Q.all(queries)).to.be.fulfilled.and.notify(done);
    });
  });
});
