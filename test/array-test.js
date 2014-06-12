var simplePgDb = require('../index');
var chai = require('chai');
var expect = chai.expect;

describe('simple-pg array helper', function () {
  var db = simplePgDb();

  describe('arrayToSqlList returns a single string which contains all the elements surrounded by parenthesis and joined by ","', function () {
    it('returning an empty string for empty arrays', function () {
      var result = db.array.arrayToSqlList([]);

      expect(result).to.equal('()');
    });

    it('surrounding by "\'" the elements which are strings', function () {
      var result = db.array.arrayToSqlList(['hi', 'world', 2014]);

      expect(result).to.equal('(\'hi\',\'world\',2014)');
    });

    it('using the value return by toString method when it is not an array of strings', function () {
      var result = db.array.arrayToSqlList(['hi', 'world', { year: 2014 }]);

      expect(result).to.equal('(\'hi\',\'world\',[object Object])');
    });
  });
});
