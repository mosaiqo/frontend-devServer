'use strict';

var
  _               = require('underscore'),
  objectid        = require('mongodb').ObjectID,

  // test dependencies
  mocha           = require('mocha'),
  expect          = require('chai').expect,
  sinon           = require('sinon'),
  requireHelper   = require('test/require_helper'),

  // other
  ExpandsURLMap   = require('src/modules/api/util/ExpandsURLMap'),

  // file to test
  ResponseData = requireHelper('modules/api/util/ResponseData');


describe('modules/api/util/ResponseData', function() {


  it('should return the amount of nested objects', function(done) {
    var r = new ResponseData();
    expect(r._getItemCount(null)).to.equal(0);
    expect(r._getItemCount('foo')).to.equal(1);
    expect(r._getItemCount([1,2,3,4])).to.equal(4);
    done();
  });


  it('should return the nested expands for some node', function(done) {
    var r = new ResponseData();
    expect(r._getNestedExpands('foo', [])).to.deep.equal([]);
    expect(r._getNestedExpands('foo', ['foo', 'bar', 'foo.nest1', 'foo.nest2'])).to.deep.equal(['nest1', 'nest2']);
    done();
  });


  it('should return an empty object if there is no data', function(done) {
    expect( (new ResponseData()).toJSON() ).to.deep.equal({});
    done();
  });


  it('should should expand the requested attributes', function(done) {
    var r = new ResponseData();
    // override the methods '_getNestedMeta' and '_formatNestedData'
    // because that is not being tested here
    r._getNestedMeta    = function() { return {}; };
    r._formatNestedData = function(data) { return data; };

    // mock a model instance
    var item = {
      foo: {
        aaa: 1,
        bbb: 2
      },
      bar: 4,
      getRefs: function() { return ['foo']; },
      toJSON: function() {
        return {
          foo: {
            aaa: 1,
            bbb: 2
          },
          bar: 4
        };
      }
    };

    var result = r._formatItem(item, ['foo']);

    expect(result).to.deep.equal({
      foo: {
        meta: {},
        data: {
          aaa: 1,
          bbb: 2
        }
      },
      bar: 4
    });

    done();
  });


  describe('_formatNestedData', function() {

    it('should call _formatItem once if a single data item is provided', function(done) {
      var r = new ResponseData();
      var formatItemStub = sinon.stub(r, '_formatItem').returns({foo:1});

      var data = {bar:2};
      var formattedData = r._formatNestedData(data);

      expect(formatItemStub.calledOnce).to.be.true;
      expect(formattedData).to.deep.equal({ foo: 1 });
      done();
    });


    it('should call _formatItem multiple times if a data array is provided', function(done) {
      var r = new ResponseData();
      var formatItemStub = sinon.stub(r, '_formatItem').returns({foo:1});

      var data = [{bar:2}, {bar:3}];
      var formattedData = r._formatNestedData(data);

      expect(formatItemStub.calledTwice).to.be.true;
      expect(formattedData).to.deep.equal([{ foo: 1 }, { foo: 1 }]);
      done();
    });

  });


  it('should return the "meta" node for the nested objects', function(done) {
    var expandsMap = new ExpandsURLMap({
      author: {
        route: '/authors/:itemId'
      },
      owner: {
        route: '/users/:itemId'
      },
      whatever: {
        route: '/whatever/:itemId'
      },
      tags: {
        route: '/blog/articles/:parentId/tags'
      }
    });

    var data = {
      author: {_id:48},
      owner: objectid('000000000000000000000001'),
      whatever:  null,
      tags: []
    };
    var entityId = 24;
    var r = new ResponseData('http://localhost/api', [], expandsMap);

    var meta = r._getNestedMeta(data.author, ['author']);
    expect(meta).to.deep.equal({ count: 1, url: 'http://localhost/api/authors/48' });

    meta = r._getNestedMeta(data.owner, ['owner']);
    expect(meta).to.deep.equal({ count: 1, url: 'http://localhost/api/users/000000000000000000000001' });

    meta = r._getNestedMeta(data.whatever, ['whatever']);
    expect(meta).to.deep.equal({ count: 0, url: '' });

    meta = r._getNestedMeta([], ['whatever']);
    expect(meta).to.deep.equal({ count: 0, url: '' });

    meta = r._getNestedMeta([], ['xxx']);
    expect(meta).to.deep.equal({ count: 0, url: '' });

    meta = r._getNestedMeta(data.tags, ['tags'], entityId);
    expect(meta).to.deep.equal({ count: 0, url: 'http://localhost/api/blog/articles/24/tags' });
    done();
  });

});
