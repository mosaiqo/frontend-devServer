/* global require, module, process, console, describe, it, before, after, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  // test dependencies
  mocha             = require('mocha'),
  expect            = require('chai').expect,
  faker             = require('faker'),
  id                = require('pow-mongodb-fixtures').createObjectId,
  mongoose          = require('mongoose'),
  requireHelper     = require('test/require_helper'),
  mongoConfigParser = require('src/lib/mongoConfigParser'),

  // file being tested
  Article           = requireHelper('modules/api/models/blog/Article');




describe('Blog Article model', function() {

  this.timeout(10000);

  before(function(done) {
    var mongoConn = new mongoConfigParser().setEnv({
      host     : process.env.MONGO_HOST,
      port     : process.env.MONGO_PORT,
      user     : process.env.MONGO_USER,
      password : process.env.MONGO_PASSWORD,
      database : process.env.MONGO_DATABASE
    });

    mongoose.connect(mongoConn.getConnectionString(), mongoConn.getConnectionOptions());
    mongoose.connection.once('open', done);
  });


  after(function(done) {
    mongoose.connection.close(done);
  });


  it('should save the article', function(done) {
    var defaultUserId = id('000000000000000000000001');
    var articleData = {
      title:   faker.lorem.sentence(),
      body:    faker.lorem.paragraphs(2),
      author:  defaultUserId,
      owner:   defaultUserId
    };

    var article = new Article(articleData);

    article.save(function(err, article) {
      expect(article.title).to.equal(articleData.title);
      expect(article.body).to.equal(articleData.body);
      article.remove();
      done();
    });
  });


  it('should transform the virtual attributes when /saving/fetching', function(done) {
    var defaultUserId = id('000000000000000000000001');
    var articleData = {
      title:        faker.lorem.sentence(),
      body:         faker.lorem.paragraphs(2),
      author:       defaultUserId,
      owner:        defaultUserId,
      published_at: new Date()
    };

    var article = new Article(articleData);

    article.save(function(err, article) {
      var articleJSON = article.toJSON();

      expect(articleJSON).to.have.property('id');
      expect(articleJSON).to.not.have.property('_id');
      expect(articleJSON.created_at).to.match(/^\d{10}$/);
      expect(articleJSON.updated_at).to.match(/^\d{10}$/);
      expect(articleJSON.publish_date).to.match(/^\d{10}$/);
      article.remove();

      done();
    });

  });

});
