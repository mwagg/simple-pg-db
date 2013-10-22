'use strict';

module.exports = function (params) {
  var clonedParams;
  var additionalParams;
  var connString;

  if ((!params) || (Object.keys(params).length === 0)) {
    return 'postgres://';
  }

  if (!params.host) {
    throw new Error('When parameters are provided, "host" parameter is required');
  }


  clonedParams = JSON.parse(JSON.stringify(params));
  connString = clonedParams.host;
  delete clonedParams.host;

  if (clonedParams.user) {
    if (clonedParams.password) {
      connString = clonedParams.user + ':' + clonedParams.password + '@' + connString;
      delete clonedParams.password;
    } else {
      connString = clonedParams.user + '@' + connString;
    }
    
    delete clonedParams.user;
  }

  if (clonedParams.port) {
    connString += ':' + clonedParams.port;
    delete clonedParams.port;
  }

  if (clonedParams.dbname) {
    connString += '/' + clonedParams.dbname;
    delete clonedParams.dbname;
  }

  additionalParams = Object.keys(clonedParams);

  if (additionalParams.length > 0) {
    connString += '?' + additionalParams[0];
    additionalParams.shift();

    additionalParams.forEach(function (pName) {
      connString += '&' + pName + '=' + clonedParams[pName];
    });
  }

  return 'postgres://' + connString;
};
