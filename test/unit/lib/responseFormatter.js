/* global require, module, process, console, describe, it, before, after, afterEach, __dirname */
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
  requireHelper  = require(projectRootDir + 'test/require_helper'),

  // file to test
  resFormatter  = requireHelper('lib/responseFormatter');



describe('lib/responseFormatter', function() {


  it('should return return an "errors" object if supplied', function(done) {
    var res;

    res = resFormatter(null, null, {
      error: true
    });

    expect(res).to.have.property('error');

    res = resFormatter();

    expect(res).to.not.have.property('error');

    done();
  });


  it('should return return a "data" object wrapping the content', function(done) {

    var content, res;

    res = resFormatter(content);
    expect(res).to.have.property('data');
    expect(res.data).to.be.empty;

    content = {
      foo: 'bar'
    };
    res = resFormatter(content);
    expect(res).to.have.property('data');
    expect(res.data).not.to.be.empty;

    done();
  });


  it('should return return a "meta" object', function(done) {
    var content, meta, res;

    res = resFormatter(content);
    expect(res).to.have.property('meta');

    meta = {
      foo: 'bar'
    };
    res = resFormatter(content);
    expect(res).to.have.property('meta');

    done();
  });
});
