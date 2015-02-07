/* global require, module, process, console, describe, it, before, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  // paths
  appRootDir    = __dirname + '/../../../src/',

  // test dependencies
  mocha         = require('mocha'),
  expect        = require('chai').expect,
  request       = require('supertest'),
  _             = require('underscore'),

  // server
  app           = require(appRootDir + 'app').app;


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

    expect(obj).to.have.property('_id');
    expect(obj).to.have.property('name');
    expect(obj).to.have.property('description');
    expect(obj).to.have.property('url');
    expect(obj).to.have.property('active');

    expect(obj._id).not.to.be.null;
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


  // -- GET ALL ---------------------------------

  describe('Get all media objects -> GET /api/media', function() {

    it('returns an array of media objects', function(done) {
      request(app)
        .get('/api/media')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {

          expect(err).to.not.exist;

          expect(_.isArray(res.body)).to.be.true;

          expect(res.body).to.have.length.of.at.least(2);

          // save a reference for later usage
          firstRecord = res.body[0];

          // check the node attributes
          isValidMediaObject(firstRecord);

          done();
        });
    });
  });


  // -- GET ONE ---------------------------------

  describe('Get one media object -> GET /api/media/:id', function() {

    it('retuns a 404 error if the model does not exist', function(done) {
      request(app)
        .get('/api/media/a-non-existing-record-id')
        .expect(404, done);
    });


    it('returns a Media object', function(done) {
      request(app)
        .get('/api/media/'+firstRecord._id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {

          expect(err).to.not.exist;

          // check the node attributes
          isValidMediaObject(res.body);

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


    it('returns the created object', function(done) {

      var obj = getModelObject();

      request(app)
        .post('/api/media/')
        .send(obj)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {

          expect(err).to.not.exist;

          // save the reference for the next test
          createdModel = res.body;

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
      request(app).get('/api/media/'+createdModel._id).end(function(err, res) {
        expect(res.body._id).to.equal(createdModel._id);
        done();
      });
    });

  });


  // -- UPDATE ----------------------------------

  describe('Update a media object -> PUT /api/media/:id', function() {

    it('retuns a 404 error if the model does not exist', function(done) {
      request(app)
        .put('/api/media/a-non-existing-record-id')
        .expect(404, done);
    });


    it('returns the modified model', function(done) {
      var newAttrs = {
        name        : 'CCC',
        description : 'DDD',
        url         : 'http://qux.baz',
        active      : false
      };

      request(app)
        .put('/api/media/'+createdModel._id)
        .send(newAttrs)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {

          var model = res.body;

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

    it('retuns a 404 error if the model does not exist', function(done) {
      request(app)
        .delete('/api/media/a-non-existing-record-id')
        .expect(404, done);
    });


    it('returns the deleted model', function(done) {
      request(app)
        .delete('/api/media/'+firstRecord._id)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {

          expect(err).to.not.exist;

          deletedModel = res.body;

          // check the node attributes
          isValidMediaObject(deletedModel);

          done();
        });
    });


    it('deletes the requested model', function(done) {
      request(app).get('/api/media/'+deletedModel._id).expect(404, done);
    });

  });


});
