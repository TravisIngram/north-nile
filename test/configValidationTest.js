var expect = require('chai').expect;
var config = require('../config');

describe('config', function(){
  describe('#dbConnection', function() {
    it('has a db connection string', function() {
      expect(config.dbConnection).to.be.a('string');
      expect(config.dbConnection).to.have.length.above(1);
    });

    it('defaults to localhost', function() {
      expect(config.dbConnection).to.eq('postgres://localhost:5432/north_nile');
    });

    it('is overridden in the environement', function() {
      var dbName = 'postgres://127.0.0.1:5432/some_random_db';
      process.env.DATABASE_URL = dbName;

      // Remove the config from the cache so it'll re-load the new db name.
      delete require.cache[require.resolve('../config.js')];
      var newConfig = require('../config');
      expect(newConfig.dbConnection).to.eq(dbName);
    });
  });

  describe('#port', function() {
    it('defaults to 3000', function() {
      expect(config.port).to.be.a('number');
      expect(config.port).to.eq(3000);
    });

    it('uses 3000 if port is not a number', function() {
      var portNum = 'abc';
      process.env.PORT = portNum;

      // Remove the config from the cache so it'll re-load the new db name.
      delete require.cache[require.resolve('../config.js')];
      var newConfig = require('../config');
      expect(config.port).to.be.a('number');
      expect(newConfig.port).not.to.eq(portNum);
      expect(newConfig.port).to.eq(3000);
    });

    it('is overridden with the PORT env variable', function() {
      var portNum = 4500;
      process.env.PORT = portNum;

      // Remove the config from the cache so it'll re-load the new db name.
      delete require.cache[require.resolve('../config.js')];
      var newConfig = require('../config');
      expect(config.port).to.be.a('number');
      expect(newConfig.port).to.eq(portNum);
    })
  })
});