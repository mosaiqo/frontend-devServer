'use strict';

var
  _               = require('underscore'),

  // test dependencies
  mocha           = require('mocha'),
  expect          = require('chai').expect,
  requireHelper   = require('test/_util/require_helper'),

  // other
  ExpandsURLMap   = require('src/modules/api/util/ExpandsURLMap'),

  // file to test
  Response = requireHelper('modules/api/util/Response');


describe('modules/api/util/Response', function() {

  var original_expandData;

  before(function(done) {
    // override the '_expandData' method so it
    // does not call the database during the tests
    original_expandData = Response.prototype._expandData;

    Response.prototype._expandData = function(data, expands, callback) {
      callback(null, data);
    };
    done();
  });


  after(function(done) {
    // restore the overrided method
    Response.prototype._expandData = original_expandData;
    done();
  });


  it('should allow setting the pagination params', function(done) {
    var response = new Response(null, new ExpandsURLMap());
    var
      pageCount = 4,
      itemCount = 20;

    var resp = response.setPaginationParams(pageCount, itemCount);

    // the method is chainable (it returns the instance)
    expect(response).to.deep.equal(resp);

    expect(response).to.have.property('paginationParams');
    expect(response.paginationParams).to.not.be.null;

    expect(response.paginationParams.pageCount).to.equal(pageCount);
    expect(response.paginationParams.itemCount).to.equal(itemCount);

    done();
  });


  it('should format the response', function(done) {
    // mock the request obj
    var request = {
      getExpands: function() { return ['a', 'b']; }
    };

    var response = new Response(request, new ExpandsURLMap());

    response.formatOutput({}, function(error, formattedOutput) {
      expect(error).to.be.null;
      expect(formattedOutput).to.have.property('meta');
      expect(formattedOutput).to.have.property('data');
      done();
    });
  });

});
