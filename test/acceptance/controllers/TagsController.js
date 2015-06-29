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
  objectid       = require('mongodb').ObjectID,

  // file to test
  TagsController  = requireHelper('modules/api/controllers/blog/TagsController');


/**
 * @todo : improve this tests...
 */
describe('TagsController', function() {
/*
  describe('TagsController.retrieveAndCreate', function() {

    it('should return an empty array if there are no tags in the request', function(done) {
      var controller = new TagsController();

      // fake the req obj
      var req = {
        user:  { userId: 20 },
        body:  {},
        query: {}
      };

      controller.retrieveAndCreate(req, null, function(data) {
        expect(data).to.deep.equal([]);
        done();
      });
    });


    it('should accept a single tag', function(done) {
      var controller = new TagsController();

      // fake the req obj
      var req = {
        user:  { userId: '000000000000000000000001' },
        body:  { tags_names: 'foo' },
        query: {}
      };

      // create some fake models
      controller.retrieveAndCreate(req, null, function(data) {
        expect(Array.isArray(data)).to.be.true;
        expect(objectid.isValid(data[0])).to.be.true;
        done();
      });
    });


    it('should accept multiple tags', function(done) {
      var controller = new TagsController();

      // fake the req obj
      var req = {
        user:  { userId: '000000000000000000000001' },
        body:  { tags_names: ['xxx', 'yyy', 'foo'] },
        query: {}
      };

      // create some fake models
      controller.retrieveAndCreate(req, null, function(data) {
        expect(Array.isArray(data)).to.be.true;
        data.forEach(function(id) {
          expect(objectid.isValid(id)).to.be.true;
        });
        done();
      });
    });


    it('should not create anything if the tags already exist', function(done) {
      var controller = new TagsController();

      // fake the req obj
      var req = {
        user:  { userId: '000000000000000000000001' },
        body:  { tags_names: ['xxx', 'yyy', 'foo'] },
        query: {}
      };

      // create some fake models
      controller.retrieveAndCreate(req, null, function(data) {
        expect(Array.isArray(data)).to.be.true;
        data.forEach(function(id) {
          expect(objectid.isValid(id)).to.be.true;
        });
        done();
      });
    });


  });*/

});
