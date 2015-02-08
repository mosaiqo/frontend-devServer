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
  sinon          = require('sinon'),
  httpMocks      = require('node-mocks-http'),
  requireHelper  = require(projectRootDir + 'test/require_helper'),

  // filebeing tested
  routeHandlers  = requireHelper('routeHandlers');




describe('RouteHandlers', function() {

  describe('#root', function() {

    it('should respond with a file', function(done) {

      var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/',
      });

      var response = {};
      response.sendfile = sinon.spy();

      routeHandlers.root(request, response);

      expect(response.sendfile.calledOnce).to.be.true;

      done();
    });


  });

});
