/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  serverRootDir = __dirname + '/../../',
  mocha         = require('mocha'),
  expect        = require('chai').expect,
  request       = require('supertest'),
  app           = require(serverRootDir + 'app').app;


describe('Express rest api server', function() {

  describe('GET /api', function() {
    it('responds with json', function(done) {
      request(app)
        .get('/api')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
      })
  });

  // TODO: auth (when implemented)

});
