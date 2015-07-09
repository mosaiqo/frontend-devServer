'use strict';

var
  _               = require('underscore'),
  objectid        = require('mongodb').ObjectID,

  // test dependencies
  mocha           = require('mocha'),
  expect          = require('chai').expect,
  requireHelper   = require('test/_util/require_helper'),

  // file to test
  Request = requireHelper('modules/api/util/Request');


describe('modules/api/util/Request', function() {

  it('should return the full requestURL', function(done) {
    // mock the req. object
    var req = {
      protocol: 'http',
      headers: {
        host: 'localhost:99'
      },
      baseUrl: '/api',
      path: '/foo'
    };

    expect((new Request(req).requestURL)).to.equal('http://localhost:99/api/foo');
    done();
  });


  it('should return the requestBaseURL (the API URL)', function(done) {
    // mock the req. object
    var req = {
      protocol: 'http',
      headers: {
        host: 'localhost:99'
      },
      baseUrl: '/api',
      path: '/foo'
    };

    expect((new Request(req).requestBaseURL)).to.equal('http://localhost:99/api');
    done();
  });


  it('should return the data owner from the authorisation', function(done) {
    // mock the req. object
    var req = {
      user: {
        userId: 1234
      }
    };

    expect((new Request(req).getOwnerFromAuth())).to.equal(1234);
    done();
  });


  it('should return an empty array if no expands are requested', function(done) {
    // mock the req. object
    var req = {
      query: {}
    };
    expect((new Request(req).getExpands())).to.deep.equal([]);
    done();
  });


  it('should returns the requested expands', function(done) {
    // mock the req. object
    var req = {
      query: {
        expand: ['foo', 'bar']
      }
    };
    expect((new Request(req).getExpands())).to.deep.equal(['foo', 'bar']);
    done();
  });

  it('should limit the expands to a certain nesting level', function(done) {
    // mock the req. object
    var req = {
      query: {
        expand: ['foo', 'foo.bar', 'foo.bar.baz']
      }
    };
    expect((new Request(req).getExpands())).to.deep.equal(['foo']);
    expect((new Request(req).getExpands(2))).to.deep.equal(['foo', 'foo.bar']);
    expect((new Request(req).getExpands(3))).to.deep.equal(['foo', 'foo.bar', 'foo.bar.baz']);
    done();
  });


  it('should return a default sort order', function(done) {
    // mock the req. object
    var req = {
      query: {}
    };
    expect((new Request(req)._getSortOrder())).to.equal('asc');
    done();
  });


  it('should normalize the sort order', function(done) {
    expect((new Request({query: { order: 'desc' }})._getSortOrder())).to.equal('desc');
    expect((new Request({query: { order: 'DESC' }})._getSortOrder())).to.equal('desc');
    expect((new Request({query: { order: '-1' }})._getSortOrder())).to.equal('desc');
    expect((new Request({query: { order: 'asc' }})._getSortOrder())).to.equal('asc');
    expect((new Request({query: { order: 'ASC' }})._getSortOrder())).to.equal('asc');
    expect((new Request({query: { order: '1' }})._getSortOrder())).to.equal('asc');

    // just an invalid value
    expect((new Request({query: { order: 'xxx' }})._getSortOrder())).to.equal('asc');

    done();
  });


  it('should return null if no sorting is requested', function(done) {
    expect((new Request({query: {}})._getSort())).to.be.null;
    expect((new Request({query: { order: '1' }})._getSort())).to.be.null;
    done();
  });


  it('should return the sorting params', function(done) {
    // mock the req. object
    var req = {
      query: {
        sort_by: 'foo'
      }
    };
    expect((new Request(req)._getSort())).to.deep.equal({
      foo: 'asc' // the default
    });

    req = {
      query: {
        sort_by: ['foo', 'bar']
      }
    };
    expect((new Request(req)._getSort())).to.deep.equal({
      foo: 'asc', // the default
      bar: 'asc' // the default
    });

    req = {
      query: {
        sort_by: ['foo', 'bar'],
        order: 'desc'
      }
    };
    expect((new Request(req)._getSort())).to.deep.equal({
      foo: 'desc',
      bar: 'desc'
    });
    done();
  });


  it('should return the options', function(done) {
    // mock the req. object
    var req = {query: {}};
    expect((new Request(req)).options).to.deep.equal({});

    req = {
      query: {
        sort_by: ['foo', 'bar'],
        order: 'desc'
      }
    };
    expect((new Request(req)).options).to.deep.equal({
      sortBy: {
        foo: 'desc',
        bar: 'desc'
      }
    });
    done();
  });


  it('should return the pagination with some defaults', function(done) {
    // mock the req. object
    var req = {query: {}};
    var pagination = (new Request(req)).pagination;

    expect(pagination).to.have.property('page');
    expect(pagination).to.have.property('per_page');
    expect(pagination).to.not.have.property('sortBy');
    expect(pagination.page).to.equal(1);
    expect(pagination.per_page).to.equal(20);
    done();
  });


  it('should return the pagination with the requested params', function(done) {
    // mock the req. object
    var req = {query: {
      page: 4,
      per_page: 40,
      sort_by: 'foo',
      order: 'desc'
    }};
    var pagination = (new Request(req)).pagination;

    expect(pagination).to.have.property('page');
    expect(pagination).to.have.property('per_page');
    expect(pagination).to.have.property('sortBy');
    expect(pagination.page).to.equal(4);
    expect(pagination.per_page).to.equal(40);
    expect(pagination.sortBy).to.deep.equal({ 'foo': 'desc' });

    done();
  });

});
