/* global require, module, process, console, describe, it, before, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  // paths
  projectRootDir = '../../',
  appRootDir     = projectRootDir + 'src/',

  // test dependencies
  mocha          = require('mocha'),
  expect         = require('chai').expect,
  request        = require('supertest'),
  requireHelper  = require(projectRootDir + 'test/require_helper'),

  // server
  app            = requireHelper('app').app;




describe('App', function() {

  describe('GET /', function() {

    it('should respond with an html', function(done) {
      request(app)
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200, done);
    });


  });

});