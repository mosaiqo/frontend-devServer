/* global require, module, process, console, describe, it, before, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  // paths
  projectRootDir = '../../../',
  appRootDir     = projectRootDir + 'src/',

  // test dependencies
  mocha          = require('mocha'),
  expect         = require('chai').expect,
  requireHelper  = require(projectRootDir + '/test/require_helper'),

  // file to test
  apiUtil  = requireHelper('lib/apiUtil');




describe('lib/apiUtil', function() {

  describe('#getErrorResponse', function() {

  	it('should return an object with a an error, error code and a message attributes', function(done) {

  		var errorObj = apiUtil.getErrorResponse(404);

  		expect(errorObj).to.have.to.have.property('error');
  		expect(errorObj).to.have.to.have.property('errorCode');
  		expect(errorObj).to.have.to.have.property('message');
  		expect(errorObj.error).to.be.true;


      errorObj = apiUtil.getErrorResponse(500);

      expect(errorObj).to.have.to.have.property('error');
      expect(errorObj).to.have.to.have.property('errorCode');
      expect(errorObj).to.have.to.have.property('message');
      expect(errorObj.error).to.be.true;

  		done();
  	});


  	it('should return an object with a numeric error code', function(done) {

  		var errorObj = apiUtil.getErrorResponse(404);

  		expect(errorObj.errorCode).to.be.a('number');

      apiUtil.getErrorResponse(500);

      expect(errorObj.errorCode).to.be.a('number');

  		done();
  	});


  	it('should return an object with a 404 errorCode if the code attribute is not supplied', function(done) {

  		var errorObj = apiUtil.getErrorResponse();

  		expect(errorObj.errorCode).to.equal(404);

  		done();
  	});


  	it('should return an object with an error message equal to the supplied one', function(done) {

  		var
  			errMsg   = 'holaquetal',
  			errorObj = apiUtil.getErrorResponse(404, errMsg);

  		expect(errorObj.message).to.be.a('string');

  		done();
  	});


  	it('should return an object with a errorObject attribute as a STRING if supplied', function(done) {

  		expect( apiUtil.getErrorResponse() ).not.to.have.property('errorObject');

  		expect( apiUtil.getErrorResponse(404, 'foo', 888888888).errorObject ).to.be.a('string');
  		expect( apiUtil.getErrorResponse(404, 'foo', 'abcdefg').errorObject ).to.be.a('string');
  		expect( apiUtil.getErrorResponse(404, 'foo', {a:1,b:2}).errorObject ).to.be.a('string');
  		expect( apiUtil.getErrorResponse(404, 'foo', [1,2,3,4]).errorObject ).to.be.a('string');

  		done();
  	});

  });

});
