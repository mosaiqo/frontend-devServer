/* global require, module, process, console, describe, it, before, after, afterEach, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  _              = require('underscore'),

  // test dependencies
  mocha          = require('mocha'),
  expect         = require('chai').expect,
  requireHelper  = require('test/require_helper'),

  // file to test
  RequestUtil    = requireHelper('modules/api/util/apiRequestUtil');


describe('modules/api/util/apiRequestUtil', function() {

  it('should return a query object that restricts the results to the entities owned by the requester', function(done) {

    // mock the request
    var req = {
      user: {
        userId: 1
      },
      query: {}
    };

    var
      r = new RequestUtil(req),
      q = r.query;

    expect(q).to.be.an('object');
    expect(q).to.have.property('owner');
    expect(q.owner).to.equal(req.user.userId);

    done();
  });


  describe('meta', function() {

    it('should return the request meta with the resource API url', function(done) {

      // mock the request
      var req = {
        protocol: 'http',
        get: function() { return 'localhost'; },
        path: '/api/someCollection',
        query : {}
      };

      var
        r    = new RequestUtil(req),
        meta = r.getMeta();

      expect(meta).to.be.an('object');
      expect(meta).to.have.property('url');
      expect(meta.url).to.equal('http://localhost/api/someCollection');

      // again for a model
      var someModel = { id: '55829f869d627407c6786a4a' };

      meta = r.getMeta(someModel);

      expect(meta.url).to.equal('http://localhost/api/someCollection/55829f869d627407c6786a4a');

      done();
    });


    it('should return the request meta with a paginator object', function(done) {

      // mock the request
      var req = {
        protocol: 'http',
        get: function() { return 'localhost'; },
        path: '/api/foo',
        query : {
          per_page: 2,
          page: 1,
        }
      };

      var
        // obtained from a paginated mongoose query...
        itemCount = 100,
        pageCount = 10,

        r    = new RequestUtil(req),
        meta = r.getMeta(null, { itemCount: itemCount, pageCount: pageCount});

      expect(meta).to.be.an('object');
      expect(meta).to.have.property('paginator');
      expect(meta.paginator).to.be.an('object');

      done();
    });



  });


  describe('pagination', function() {

    it('should return the requested page', function(done) {

      // mock the request
      var req = {
        protocol: 'http',
        get: function() { return 'localhost'; },
        path: '/api/foo',
        query : {
          per_page: 2,
          page: 4,
        }
      };

      var
        // obtained from a paginated mongoose query...
        itemCount = 100,
        pageCount = 10,

        r    = new RequestUtil(req),
        meta = r.getMeta(null, { itemCount: itemCount, pageCount: pageCount});

      expect(r).to.have.property('page');
      expect(r.page).to.equal(req.query.page);

      req = {
        protocol: 'http',
        get: function() { return 'localhost'; },
        path: '/api/foo',
        query : {}
      };

      r    = new RequestUtil(req);
      meta = r.getMeta(null, { itemCount: itemCount, pageCount: pageCount});

      expect(r).to.have.property('page');
      expect(r.page).to.equal(1);

      done();
    });


    it('should return the requested limit', function(done) {

      // mock the request
      var req = {
        protocol: 'http',
        get: function() { return 'localhost'; },
        path: '/api/foo',
        query : {
          per_page: 2,
          page: 1,
        }
      };

      var
        // obtained from a paginated mongoose query...
        itemCount = 100,
        pageCount = 10,

        r    = new RequestUtil(req),
        meta = r.getMeta(null, { itemCount: itemCount, pageCount: pageCount});

      expect(r).to.have.property('limit');
      expect(r.limit).to.equal(req.query.per_page);

      req = {
        protocol: 'http',
        get: function() { return 'localhost'; },
        path: '/api/foo',
        query : {
          limit: 2,
          page: 1,
        }
      };

      expect(r).to.have.property('limit');
      expect(r.limit).to.equal(req.query.limit);

      done();
    });



    it('should return the pagination attributes', function(done) {

      // mock the request
      var req = {
        protocol: 'http',
        get: function() { return 'localhost'; },
        path: '/api/foo',
        query : {
          per_page: 2,
          page: 1,
        }
      };

      var
        // obtained from a paginated mongoose query...
        itemCount = 100,
        pageCount = 10,

        r    = new RequestUtil(req),
        meta = r.getMeta(null, { itemCount: itemCount, pageCount: pageCount});

      expect(meta.paginator).to.have.property('total_entries');
      expect(meta.paginator.total_entries).to.equal(itemCount);

      expect(meta.paginator).to.have.property('total_pages');
      expect(meta.paginator.total_pages).to.equal(pageCount);

      expect(meta.paginator).to.have.property('page');
      expect(meta.paginator.page).to.equal(req.query.page);

      expect(meta.paginator).to.have.property('per_page');
      expect(meta.paginator.per_page).to.equal(req.query.per_page);

      req = {
        protocol: 'http',
        get: function() { return 'localhost'; },
        path: '/api/foo',
        query : {
          limit: 2,
          page: 1,
          sort_by: 'foo'
        }
      };
      r    = new RequestUtil(req);
      meta = r.getMeta(null, { itemCount: itemCount, pageCount: pageCount});

      expect(meta.paginator).to.have.property('per_page');
      expect(meta.paginator.per_page).to.equal(req.query.limit);

      expect(meta.paginator).to.have.property('sort_by');
      expect(meta.paginator.sort_by).to.equal(req.query.sort_by);

      expect(meta.paginator).to.have.property('order');
      expect(meta.paginator.order).to.equal('asc');

      req = {
        protocol: 'http',
        get: function() { return 'localhost'; },
        path: '/api/foo',
        query : {
          limit: 2,
          page: 1,
          sort_by: ['foo', 'bar'],
          order: 'desc'
        }
      };
      r    = new RequestUtil(req);
      meta = r.getMeta(null, { itemCount: itemCount, pageCount: pageCount});

      expect(meta.paginator).to.have.property('sort_by');
      expect(meta.paginator.sort_by).to.deep.equal(req.query.sort_by);

      expect(meta.paginator).to.have.property('order');
      expect(meta.paginator.order).to.equal(req.query.order);

      req = {
        protocol: 'http',
        get: function() { return 'localhost'; },
        path: '/api/foo',
        query : {
          limit: 2,
          page: 1,
          sort_by: ['foo', 'bar'],
          order: 'CATACROQUER'
        }
      };
      r    = new RequestUtil(req);
      meta = r.getMeta(null, { itemCount: itemCount, pageCount: pageCount});

      expect(meta.paginator).to.have.property('sort_by');
      expect(meta.paginator.sort_by).to.deep.equal(req.query.sort_by);

      expect(meta.paginator).to.have.property('order');
      expect(meta.paginator.order).to.equal('asc');


      done();
    });
  });


  it('should return the nested attributes to expand', function(done) {

    // mock the request
    var req = {
      protocol: 'http',
      get: function() { return 'localhost'; },
      path: '/api/foo',
      query : {},
      user: {
        userId: 1
      }
    };

    var r = new RequestUtil(req);

    expect(r).to.have.property('expands');
    expect(r.expands).to.equal('');

    req = {
      protocol: 'http',
      get: function() { return 'localhost'; },
      path: '/api/foo',
      query : {
        expand: ['nestedObj1', 'nestedObj2']
      },
      user: {
        userId: 1
      }
    };

    r = new RequestUtil(req);

    expect(r).to.have.property('expands');
    expect(r.expands).to.equal(req.query.expand.join(' '));

    done();
  });

});
