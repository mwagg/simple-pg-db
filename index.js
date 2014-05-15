var pg = require("pg");
var Q = require("q");
var connectionString = require("./connection-string");
var arrayParsePattern = /{(.*)}/;

module.exports = function (opts) {
  var connString = (!opts || !opts.connectionString) ? connectionString(opts) : opts.connectionString;

  return {
    query: function (query, params) {
      return Q.ninvoke(pg, 'connect', connString)
      .then(
        function (args) { 
          var client = args[0]; var done = args[1];
          return Q.ninvoke(client, 'query', query, params)
          .then(function (result) {
            done();
            return result;
          });
        });
    },

    array: {
      arrayToSqlList: function (values) {
        function surroundString(stringValue, surroundString) {
          return surroundString + stringValue + surroundString;
        }

        var originalValue = null;

        if (values.length >= 1) {
          if ('string' === typeof values[0]) {
            return values.reduce(function (previousValue, currentValue) {
              return surroundString(previousValue, '\'') + ',' + surroundString(currentValue, '\'');
            });
          } else {
            return values.reduce(function (previousValue, currentValue) {
              return previousValue + ',' + currentValue;
            });
          }
        } else {
          return '';
        }
      },

      arrayToSql: function (values) {
        return "{" + values.join(",") + "}";
      },

      parseArray: function (array) {
        return array.match(arrayParsePattern)[1].split(",");
      }
    }
  };
};
