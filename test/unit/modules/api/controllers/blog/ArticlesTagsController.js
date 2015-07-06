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

});
