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
  ArticlesController = requireHelper('modules/api/controllers/blog/ArticlesController');

describe('ArticlesController', function() {

  describe('_setTags', function() {
    it('should rturn a validation error if a string is supplied and it\'s not a valid JSON', function(done) {
      (new ArticlesController())._setTags({}, { tags: 'some-random-string' }, function(err, model) {
        expect(err).to.not.be.null;
        expect(err.name).to.equal('ValidationError');
        done();
      });
    });
  });
});
