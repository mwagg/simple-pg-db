var connectionString = require('../connection-string');
var chai = require('chai');
var expect = chai.expect;

describe('connectionString', function () {
  it('returns "postgres://" when it is called withou paramters', function () {
    expect(connectionString()).to.be.equal('postgres://');
  });

  it('returns "postgres://localhost" when it is called with the host "localhost"', function () {
    var params = {
      host: 'localhost'
    };

    expect(connectionString(params)).to.be.equal('postgres://localhost');
  });

  it('returns "postgres://my.db" when it is called with the host "my.db"', function () {
    var params = {
      host: 'my.db'
    };

    expect(connectionString(params)).to.be.equal('postgres://my.db');
  });

  it('returns "postgres://my.db:3000" when it is called with host "my.db" and port 3000', function () {
    var params = {
      host: 'my.db',
      port: 3000
    };

    expect(connectionString(params)).to.be.equal('postgres://my.db:3000');
  });

  it('returns "postgres://ivan@my.db:3000" when it is called with host "my.db", port 3000 and user "ivan"', function () {
    var params = {
      host: 'my.db',
      port: 3000,
      user: 'ivan'
    };

    expect(connectionString(params)).to.be.equal('postgres://ivan@my.db:3000');
  });

  it('returns "postgres://ivan:test@my.db:3000" when it is called with host "my.db", port 3000, user "ivan" and password "test"', function () {
    var params = {
      host: 'my.db',
      port: 3000,
      user: 'ivan',
      password: 'test'
    };

    expect(connectionString(params)).to.be.equal('postgres://ivan:test@my.db:3000');
  });

  it('throws an exception when it is called with host "my.db", port 3000 and password "test"', function () {
    var params = {
      host: 'my.db',
      port: 3000,
      password: 'test'
    };

    expect(connectionString.bind(null, params)).to.throw(/requires[\w\s]+user/);
  });

  it('returns "postgres://ivan:test@my.db:3000/mydata" when it is called with host "my.db", port 3000, user "ivan", password "test" and dbname "mydata"', function () {
    var params = {
      host: 'my.db',
      port: 3000,
      user: 'ivan',
      password: 'test',
      dbname: 'mydata'
    };

    expect(connectionString(params)).to.be.equal('postgres://ivan:test@my.db:3000/mydata');
  });

  it('returns "postgres://ivan:test@my.db:3000/mydata?[PARAMETERS]" when it is called with host "my.db", port 3000, user "ivan", password "test", dbname "mydata", connect_timeout 10 and client_encoding "utf8", and [PARAMETERS] are the last two parameters name=value format separated by & in any order', function () {
    var params = {
      host: 'my.db',
      port: 3000,
      user: 'ivan',
      password: 'test',
      dbname: 'mydata',
      connect_timeout: 10, 
      client_encoding: 'utf8'
    };

    var regEx = /postgres:\/\/ivan:test@my\.db:3000\/mydata\?connect_timeout=10&client_encoding=utf8|postgres:\/\/ivan:test@my\.db:3000\/mydata\?client_encoding=utf8&connect_timeout=10/
      expect(connectionString(params)).to.match(regEx);
  });

  it('returns "postgres://my.db?[PARAMETERS]" when it is called with host "my.db", application_name "myapp" and keepalives 1, and [PARAMETERS] are the last two parameters name=value format separated by & in any order', function () {
    var params = {
      host: 'my.db',
      keepalives: 1, 
      application_name: 'myapp'
    };

    var regEx = /postgres:\/\/my\.db\?application_name=myapp&keepalives=1|postgres:\/\/my\.db\?keepalives=1&application_name=myapp/
      expect(connectionString(params)).to.match(regEx);
  });

  it('throws an exception when it is called with some parameters but without the host parameter', function () {
    expect(connectionString.bind(null, {port: 3000})).to.throw(/.host.[\w\s]*is required/);
    expect(connectionString.bind(null, {user: 'ivan', password: 'test'})).to.throw(/.host.[\w\s]*is required/);
    expect(connectionString.bind(null, {dbname: 'mydb'})).to.throw(/.host.[\w\s]*is required/);
    expect(connectionString.bind(null, {connect_timeout: 10, client_encoding: 'utf8'})).to.throw(/.host.[\w\s]*is required/);
  });
});
