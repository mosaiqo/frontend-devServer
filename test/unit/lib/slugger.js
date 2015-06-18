/* global require, module, process, console, describe, it, before, after, afterEach, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  // paths
  projectRootDir = '../../../',
  appRootDir     = projectRootDir + 'src/',

  // other
  _              = require('underscore'),

  // test dependencies
  mocha          = require('mocha'),
  expect         = require('chai').expect,
  requireHelper  = require(projectRootDir + 'test/require_helper'),

  // file to test
  slugger        = requireHelper('lib/slugger');


describe('lib/slugger', function() {

  it('should return the provided slug if there are no other models with that slug', function(done) {

    // mock the model
    var Model = {
      data: [],
      find: function(search, cb) { cb(null, this.data); }
    };

    slugger(Model, 'The title', 'a slug', function(slug) {
      expect(slug).to.equal('a-slug');
    });

    done();
  });


  it('should return the provided slug with a numeric suffix if there are already other models with that slug', function(done) {

    // mock the model
    var Model = {
      data: [
        { slug: 'a-slug' },
      ],
      find: function(search, cb) { cb(null, this.data); }
    };

    slugger(Model, 'The title', 'a slug', function(slug) {
      expect(slug).to.equal('a-slug-1');
    });

    Model = {
      data: [
        { slug: 'a-slug' },
        { slug: 'a-slug-1' }
      ],
      find: function(search, cb) { cb(null, this.data); }
    };

    slugger(Model, 'The title', 'a slug', function(slug) {
      expect(slug).to.equal('a-slug-2');
    });

    done();
  });


  it('sould return the provided slugged title if no slug is provided', function(done) {

    // mock the model
    var Model = {
      data: [],
      find: function(search, cb) { cb(null, this.data); }
    };

    slugger(Model, 'The title', null, function(slug) {
      expect(slug).to.equal('The-title');
    });

    done();
  });

});
