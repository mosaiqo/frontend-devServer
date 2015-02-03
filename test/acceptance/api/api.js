/* global require, module, process, console, describe, it, before, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  appRootDir    = __dirname + '/../../../',
  mocha         = require('mocha'),
  expect        = require('chai').expect,
  request       = require('supertest'),
  app           = require(appRootDir + 'app').app;


describe('Express rest api server', function() {

  describe('GET /api', function() {
    it('responds with json', function(done) {
      request(app)
        .get('/api')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
      });
  });

  // TODO: auth (when implemented)

});
