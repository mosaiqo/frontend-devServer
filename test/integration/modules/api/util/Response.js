'use strict';

var
  _                 = require('underscore'),
  objectid          = require('mongodb').ObjectID,

  mongoose          = require('mongoose'),
  mongoConfigParser = require('src/lib/mongoConfigParser'),

  // test dependencies
  mocha             = require('mocha'),
  expect            = require('chai').expect,
  requireHelper     = require('test/require_helper'),

  // other
  Article           = require('src/modules/api/models/blog/Article'),
  ExpandsURLMap     = require('src/modules/api/util/ExpandsURLMap'),

  // file to test
  Response = requireHelper('modules/api/util/Response');


describe('modules/api/util/Response', function(done) {

  var existingArticle;

  before(function(done) {
    var mongoConn = new mongoConfigParser().setEnv({
      host     : process.env.MONGO_HOST,
      port     : process.env.MONGO_PORT,
      user     : process.env.MONGO_USER,
      password : process.env.MONGO_PASSWORD,
      database : process.env.MONGO_DATABASE
    });
    mongoose.connect(mongoConn.getConnectionString(), mongoConn.getConnectionOptions());
    mongoose.connection.once('open', function() {

      existingArticle = new Article({
        title:  'some-new-article-1',
        slug:   'some-new-article-1',
        owner:  objectid('000000000000000000000001'),
        author: objectid('000000000000000000000001'),
      });

      existingArticle.save(function(err) {
        if(err) {
          console.log(err);
        }
        done();
      });
    });
  });


  after(function(done) {
    existingArticle.remove(function() {
      mongoose.connection.close(done);
    });
  });


  it('should expand the data', function(done) {
    var response = new Response(null, new ExpandsURLMap());

    response._expandData(existingArticle, ['author'], function(err, data) {
      expect(err).to.be.undefined;
      done();
    });
  });

});
// integration
