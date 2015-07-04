'use strict';

var
  _              = require('underscore'),

  // test dependencies
  mocha          = require('mocha'),
  expect         = require('chai').expect,
  requireHelper  = require('test/require_helper'),

  // file to test
  ArticlesTagsController = requireHelper('modules/api/controllers/blog/ArticlesTagsController');

describe('ArticlesTagsController', function() {

  it('should inject the articleId to the db criteria', function(done) {
    var controller = new ArticlesTagsController();

    // mock the request
    var request = {
      req: {
        params: {
          id: 1,
          articleId: 2
        }
      },
      getOwnerFromAuth: function() {
        return 3;
      }
    };

    var criteria = controller._buildCriteria(request);

    expect(criteria).to.deep.equal({_id: 1, articles: 2, owner: 3});

    done();
  });


  it('should add the article id to the attributes to assign on "CREATE" operation', function(done) {
    var controller = new ArticlesTagsController();

    // mock the request
    var request = {
      req: {
        params: {
          id: 1,
          articleId: 2
        },
        user: {
          userId: 3
        },
        body: {
          name: 'foo',
          description: 'bar',
          aNonSafeAttr: 'baz'
        }
      }
    };

    var attrs = controller._getAssignableAttributes(request);
    expect(attrs).to.deep.equal({ owner: 3, name: 'foo', description: 'bar' });

    request = {
      req: {
        params: {
          id: 1,
          articleId: 2
        },
        user: {
          userId: 3
        },
        body: {
          name: 'foo',
          description: 'bar',
          aNonSafeAttr: 'baz'
        },
        method: 'POST'
      }
    };

    attrs = controller._getAssignableAttributes(request);
    expect(attrs).to.deep.equal({ owner: 3, articles: 2, name: 'foo', description: 'bar' });

    attrs = controller._getAssignableAttributes(request, {slug: 'qux'});
    expect(attrs).to.deep.equal({ owner: 3, articles: 2, name: 'foo', description: 'bar', slug: 'qux' });

    done();
  });

});
