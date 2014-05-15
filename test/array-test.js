var simplePgDb = require('../index');
var chai = require('chai');
var expect = chai.expect;

describe('simple-pg array helper', function () {
  var db = simplePgDb();

  describe('arrayToSqlList returns a single string which contains all the elements joined by ","', function () {
    it('returning an empty string for empty arrays', function () {
      var result = db.array.arrayToSqlList([]);

      expect(result).to.equal('');
    });

    it('surrounding by "\'" each element when it is an arrays of strings ', function () {
      var result = db.array.arrayToSqlList(['hi', 'world']);

      expect(result).to.equal('\'hi\',\'world\'');
    });

    it('using the value return by toString method when it is not an array of strings', function () {
      var result = db.array.arrayToSqlList([1, 2]);

      expect(result).to.equal('1,2');
    });

    describe('without supporting array with elements of different types, it uses the first element to figure out the elements\'s type', function () {
      it('surrounds every element with "\'" when the first element is a string', function () {
        var result = db.array.arrayToSqlList(['hi', 2]);

        expect(result).to.equal('\'hi\',\'2\'');
      })

      it('does not surround every element with "\'" when the first element is not a string', function () {
        var result = db.array.arrayToSqlList([1, 'world']);

        expect(result).to.equal('1,world');
      })
    });
  });

});
