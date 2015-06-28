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
  Tag               = requireHelper('modules/api/models/blog/Tag');




describe('BlogTag model', function() {

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


  it('should save the tag', function(done) {
    var
      defaultUserId = id('000000000000000000000001'),
      name = faker.lorem.words(1).join(),
      tagData = {
        name:        name,
        slug:        name,
        description: faker.lorem.paragraph(),
        owner:       defaultUserId
      };

    var tag = new Tag(tagData);

    tag.save(function(err, tag) {
      expect(tag.name).to.equal(tagData.name);
      expect(tag.description).to.equal(tagData.description);
      tag.remove();
      done();
    });
  });


  it('should transform the virtual attributes when /saving/fetching', function(done) {
    var
      defaultUserId = id('000000000000000000000001'),
      name = faker.lorem.words(1).join(),
      tagData = {
        name:        name,
        slug:        name,
        description: faker.lorem.paragraph(),
        owner:       defaultUserId
      };

    var tag = new Tag(tagData);

    tag.save(function(err, tag) {
      var tagJSON = tag.toJSON();

      expect(tagJSON).to.have.property('id');
      expect(tagJSON).to.not.have.property('_id');
      expect(tagJSON.created_at).to.match(/^\d{10}$/);
      expect(tagJSON.updated_at).to.match(/^\d{10}$/);
      tag.remove();

      done();
    });
  });


  it('should unlink tagged articles when deleting', function(done) {


    done();
  });

});
