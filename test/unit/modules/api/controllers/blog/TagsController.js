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
  TagsController = requireHelper('modules/api/controllers/blog/TagsController');



describe('TagsController', function() {

  it('should mass assign only the model attributes', function(done) {
    var controller = new TagsController();

    // fake the model
    var model = {
      name:        undefined,
      description: undefined,
      owner:       undefined
    };

    // fake the req obj
    var req = {
      user: {
        userId: 20
      },
      body: {
        name:            'name',
        description:     'description',
        someRandomAttr1: 'foo',
        someRandomAttr2: 'bar'
      }
    };

    var filledModel = controller.fillModelAttributes(model, req);

    expect(filledModel.name).to.equal(req.body.name);
    expect(filledModel.description).to.equal(req.body.description);
    expect(filledModel.owner).to.equal(req.user.userId);
    expect(filledModel).to.not.have.property('someRandomAttr1');
    expect(filledModel).to.not.have.property('someRandomAttr2');
    done();
  });


  it('should return the tags id attributes', function(done) {
    var
      controller = new TagsController(),
      tags = [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
      ];

    var tagsIds = controller.getTagsIds(tags);

    expect(tagsIds).to.deep.equal([1,2]);

    done();
  });


});
