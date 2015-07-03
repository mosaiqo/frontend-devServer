'use strict';

var
  _              = require('underscore'),

  // test dependencies
  mocha          = require('mocha'),
  expect         = require('chai').expect,
  requireHelper  = require('test/require_helper'),

  // file to test
  BaseController = requireHelper('modules/api/controllers/BaseController');

describe('BaseController', function() {

  it('should implement the CRUD methods', function(done) {
    var c = new BaseController();

    expect(typeof c.getOne).to.equal('function');
    expect(typeof c.getAll).to.equal('function');
    expect(typeof c.create).to.equal('function');
    expect(typeof c.update).to.equal('function');
    expect(typeof c.delete).to.equal('function');
    done();
  });

  // The following tests are somewhat innecessary, because the methods are
  // 'abstract' (there're no abstract methods on JS, not even on ES6) .
  // Just test them to avoid uncovered method warnings.

  it('should implement an asyncronous "create" method', function(done) {
    (new BaseController()).create(null, null, done);
  });

  it('should implement an asyncronous "update" method', function(done) {
    (new BaseController()).update(null, null, done);
  });
});
