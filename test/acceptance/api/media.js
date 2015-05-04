/* global require, module, process, console, describe, it, before, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  // paths
  projectRootDir = '../../../',
  appRootDir     = projectRootDir + 'src/',

  // test dependencies
  mocha          = require('mocha'),
  expect         = require('chai').expect,
  request        = require('supertest'),
  _              = require('underscore'),
  requireHelper  = require(projectRootDir + 'test/require_helper'),

  // server
  app            = requireHelper('app').app;




describe('api/media', function() {

  /**
   * References to some of the API models,
   * reused on some tests
   * @type {Object}
   */
  var firstRecord, createdModel, deletedModel;


  /**
   * Aux. method to check the node attributes returned by the CRUD operations
   * @param  {Object}  obj json node returned by the API
   */
  var isValidMediaObject = function(obj) {

    expect(obj).to.be.an('object');

    expect(obj).to.have.property('id');
    expect(obj).to.have.property('name');
    expect(obj).to.have.property('description');
    expect(obj).to.have.property('url');
    expect(obj).to.have.property('active');

    expect(obj.id).not.to.be.null;
  };


  /**
   * Reset the database before executing the tests
   * by emptying it and filling with the fixtures.
   * This is just a test/dev db, so it can be safelly nuked.
   */
  before(function(done) {
    var exec = require('child_process').exec;

    this.timeout(10000);
    exec('grunt mongo:populate', done);
  });


  /**
   * All the methods in /api/media are restricted by JWT
   * so create a default user (demo/demo)
   */
  before(function(done) {
    var exec = require('child_process').exec;

    this.timeout(10000);
    exec('grunt util:createUser --default', done);
  });


  /*
   * Get the token before the tests
   */
  var authHeader = null;

  before(function(done) {
    request(app)
      .post('/api/auth')
      .set('Accept', 'application/json')
      .send({ username: 'demo', password: 'demo' })
      .end(function(err, res) {
        authHeader = 'Bearer ' + res.body.data.token;
        done();
      });
  });


  // -- GET ALL ---------------------------------

  describe('Get all media objects -> GET /api/media', function() {

    it('should reject the request if there\'s no valid authorization header', function(done) {
      request(app)
        .get('/api/media')
        .expect('Content-Type', /application\/json/)
        .expect(401)
        .end(function(err, res) {
          expect(res.body.error).to.be.true;
          expect(res.body.errorCode).to.equal(401);
          expect(res.body).to.have.property('message');
          done();
        });
    });


    it('should return an array of media objects', function(done) {
      request(app)
        .get('/api/media')
        .set('Authorization', authHeader)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {
          var responseData = res.body.data;

          expect(err).to.not.exist;

          expect(_.isArray(responseData)).to.be.true;

          expect(responseData).to.have.length.of.at.least(2);

          // save a reference for later usage
          firstRecord = responseData[0];

          // check the node attributes
          isValidMediaObject(firstRecord);

          done();
        });
    });
  });


  // -- GET ONE ---------------------------------

  describe('Get one media object -> GET /api/media/:id', function() {

    it('should reject the request if there\'s no valid authorization header', function(done) {
      request(app)
        .get('/api/media/'+firstRecord.id)
        .expect('Content-Type', /application\/json/)
        .expect(401, done);
    });


    it('should return a 404 error if the model does not exist', function(done) {
      request(app)
        .get('/api/media/a-non-existing-record-id')
        .set('Authorization', authHeader)
        .expect(404, done);
    });


    it('returns a Media object', function(done) {
      request(app)
        .get('/api/media/'+firstRecord.id)
        .set('Authorization', authHeader)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {

          expect(err).to.not.exist;

          // check the node attributes
          isValidMediaObject(res.body.data);

          done();
        });
    });

  });


  // -- CREATE ----------------------------------

  describe('Create a new media object -> POST /api/media', function() {

    var getModelObject = function() {
      return {
        name        : 'AAA',
        description : 'BBB',
        url         : 'http://foo.bar',
        active      : false
      };
    };


    it('should reject the request if there\'s no valid authorization header', function(done) {
      var obj = getModelObject();

      request(app)
        .post('/api/media/')
        .send(obj)
        .expect('Content-Type', /application\/json/)
        .expect(401, done);
    });


    it('should return the created object', function(done) {

      var obj = getModelObject();

      request(app)
        .post('/api/media/')
        .set('Authorization', authHeader)
        .send(obj)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {

          expect(err).to.not.exist;

          // save the reference for the next test
          createdModel = res.body.data;

          // check the node attributes
          isValidMediaObject(createdModel);

          expect(createdModel.name).to.equal(obj.name);
          expect(createdModel.description).to.equal(obj.description);
          expect(createdModel.url).to.equal(obj.url);
          expect(createdModel.active).to.equal(obj.active);

          done();
        });
    });


    it('should persist the created object', function(done) {
      request(app)
        .get('/api/media/'+createdModel.id)
        .set('Authorization', authHeader)
        .end(function(err, res) {
          expect(res.body.data.id).to.equal(createdModel.id);
          done();
        });
    });

  });


  // -- UPDATE ----------------------------------

  describe('Update a media object -> PUT /api/media/:id', function() {

    var newAttrs = {
      name        : 'CCC',
      description : 'DDD',
      url         : 'http://qux.baz',
      active      : false
    };


    it('should reject the request if there\'s no valid authorization header', function(done) {
      request(app)
        .put('/api/media/'+createdModel.id)
        .send(newAttrs)
        .expect('Content-Type', /application\/json/)
        .expect(401, done);
    });


    it('should retun a 404 error if the model does not exist', function(done) {
      request(app)
        .put('/api/media/a-non-existing-record-id')
        .set('Authorization', authHeader)
        .expect(404, done);
    });


    it('should return the modified model', function(done) {
      request(app)
        .put('/api/media/'+createdModel.id)
        .set('Authorization', authHeader)
        .send(newAttrs)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {

          var model = res.body.data;

          // check the node attributes
          isValidMediaObject(model);

          expect(model.name).to.equal(newAttrs.name);
          expect(model.description).to.equal(newAttrs.description);
          expect(model.url).to.equal(newAttrs.url);
          expect(model.active).to.equal(newAttrs.active);

          done();
        });
    });

  });


  // -- DELETE ----------------------------------

  describe('Delete a media object -> DELETE /api/media/:id', function() {

    it('should reject the request if there\'s no valid authorization header', function(done) {
      request(app)
        .delete('/api/media/'+firstRecord.id)
        .expect('Content-Type', /application\/json/)
        .expect(401, done);
    });


    it('should retun a 404 error if the model does not exist', function(done) {
      request(app)
        .delete('/api/media/a-non-existing-record-id')
        .set('Authorization', authHeader)
        .expect(404, done);
    });


    it('should return the deleted model', function(done) {
      request(app)
        .delete('/api/media/'+firstRecord.id)
        .set('Authorization', authHeader)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {

          expect(err).to.not.exist;

          deletedModel = res.body.data;

          // check the node attributes
          isValidMediaObject(deletedModel);

          done();
        });
    });


    it('should delete the requested model', function(done) {
      request(app)
        .get('/api/media/'+deletedModel.id)
        .set('Authorization', authHeader)
        .expect(404, done);
    });

  });


});
