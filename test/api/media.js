/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  serverRootDir = __dirname + '/../../',
  mocha         = require('mocha'),
  expect        = require('chai').expect,
  request       = require('supertest'),
  _             = require('underscore'),
  app           = require(serverRootDir + 'app').app;


describe('api/media', function() {

  var firstRecord;


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

          expect(firstRecord).to.have.property('_id');
          expect(firstRecord).to.have.property('name');
          expect(firstRecord).to.have.property('description');
          expect(firstRecord).to.have.property('url');
          expect(firstRecord).to.have.property('active');

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

          var model = res.body;

          expect(model).to.be.an('object');

          expect(model).to.have.property('_id');
          expect(model).to.have.property('name');
          expect(model).to.have.property('description');
          expect(model).to.have.property('url');
          expect(model).to.have.property('active');

          expect(model._id).not.to.be.null;

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

    it('responds with json', function(done) {
      request(app)
        .delete('/api/media/a-non-existing-record-id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/, done)
        .expect(404, done);
    });


    it('retuns a 404 error if the model does not exist', function(done) {
      request(app)
        .delete('/api/media/a-non-existing-record-id')
        .expect(404, done);
    });




  });


});
