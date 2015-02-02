/* global require, module, process, console, describe, it, before, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  serverRootDir = __dirname + '/../../../',
  mocha         = require('mocha'),
  expect        = require('chai').expect,
  request       = require('supertest'),
  _             = require('underscore'),
  app           = require(serverRootDir + 'app').app;


describe('api/media', function() {

  var firstRecord;

  var isValidMediaObject = function(obj) {

    expect(obj).to.be.an('object');

    expect(obj).to.have.property('_id');
    expect(obj).to.have.property('name');
    expect(obj).to.have.property('description');
    expect(obj).to.have.property('url');
    expect(obj).to.have.property('active');

    expect(obj._id).not.to.be.null;
  };





  before(function(done) {
    // populate the database (the dev. one, this is only for development purposes!)
    var exec = require('child_process').exec;

    this.timeout(10000);
    exec('grunt mongo:populate', done);
  });


  // -- GET ALL ---------------------------------

  describe('Get all media objects -> GET /api/media', function() {

    it('responds with json', function(done) {
      request(app)
        .get('/api/media')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });


    it('returns an array of media objects', function(done) {
      request(app)
        .get('/api/media')
        .set('Accept', 'application/json')
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

    it('responds with json', function(done) {
      request(app)
        .get('/api/media/'+firstRecord._id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });


    it('retuns a 404 error if the model does not exist', function(done) {
      request(app)
        .get('/api/media/a-non-existing-record-id')
        .expect(404, done);
    });


    it('returns a Media object', function(done) {
      request(app)
        .get('/api/media/'+firstRecord._id)
        .set('Accept', 'application/json')
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

/*
    it('responds with json', function(done) {
      request(app)
        .post('/api/media/'+firstRecord._id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });
*/



  });


  // -- UPDATE ----------------------------------

  describe('Update a media object -> PUT /api/media/:id', function() {

    /*
    it('responds with json', function(done) {
      request(app)
        .put('/api/media/'+firstRecord._id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });
    */

    it('retuns a 404 error if the model does not exist', function(done) {
      request(app)
        .put('/api/media/a-non-existing-record-id')
        .expect(404, done);
    });



  });


  // -- DELETE ----------------------------------

  describe('Delete a media object -> DELETE /api/media/:id', function() {

    var deletedModel;

    it('responds with json', function(done) {
      request(app)
        .delete('/api/media/a-non-existing-record-id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(404, done);
    });


    it('retuns a 404 error if the model does not exist', function(done) {
      request(app)
        .delete('/api/media/a-non-existing-record-id')
        .expect(404, done);
    });


    it('returns the deleted model', function(done) {
      request(app)
        .delete('/api/media/'+firstRecord._id)
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
