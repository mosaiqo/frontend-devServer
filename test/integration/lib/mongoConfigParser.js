/* global require, module, process, console, describe, it, before, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  // paths
  appRootDir    = __dirname + '/../../../src/',
  envDir        = __dirname + '/../../../db/mongo/env',

  // test dependencies
  mocha         = require('mocha'),
  expect        = require('chai').expect,

  // file to test
  parser        = require(appRootDir + 'lib/mongoConfigParser');


describe('lib/mongoConfigParser', function() {

  var parserDefaultResponse = {
    host     : 'localhost',
    port     : 27017,
    database : 'test'
  };


  describe('#setEnvDir', function() {

    it('should set the config to the appropiate env. configuration file', function(done) {

      var
        os = require('os'),
        fs = require('fs'),

        ext = '.json',
        customEnvFile  = envDir + '/' + os.hostname().toLowerCase() + ext,
        defaultEnvFile = envDir + '/' + 'default' + ext,
        envFile        = fs.existsSync(customEnvFile) ? customEnvFile : defaultEnvFile,
        expectedResult = JSON.parse( fs.readFileSync(envFile, 'utf8') );


      var mongoConn = new parser().setEnvDir(envDir).getEnv();

      expect(mongoConn.host).to.be.equal(expectedResult.host);
      expect(mongoConn.port).to.be.equal(expectedResult.port);
      expect(mongoConn.database).to.be.equal(expectedResult.database);

      if(expectedResult.user) {
        expect(mongoConn.user).to.be.equal(expectedResult.user);
      }

      if(expectedResult.password) {
        expect(mongoConn.password).to.be.equal(expectedResult.password);
      }

      done();
    });

  });

});
