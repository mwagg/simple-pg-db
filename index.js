pg = require("pg");
Q = require("q");

var arrayParsePattern = /{(.*)}/;

module.exports = function (opts) {
  return {
    query: function (query, params) {
      var deferred = Q.defer();

      var resolver = function (err, results) {
        if (err !== null) {
          deferred.reject(err);
          return;
        }

        deferred.resolve(results);
      };

      var args = [query];
      if (params !== undefined) {
        args.push(params); 
      }
      args.push(resolver);

      pg.connect(opts.connectionString, function (err, client) {
        client.query.apply(client, args);
      });

      return deferred.promise;
    },

    array: {
      arrayToSql: function (values) {
        return "{" + values.join(",") + "}";
      },

      parseArray: function (array) {
        return array.match(arrayParsePattern)[1].split(",");
      }
    }
  };
};
