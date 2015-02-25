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
  mongodb        = require('mongodb'),
  objectid       = mongodb.BSONPure.ObjectID,
  requireHelper  = require(projectRootDir + 'test/require_helper'),

  // server
  app            = requireHelper('app').app;




describe('Express rest api server', function() {

  var defaultUser = {
    username: 'demo',
    password: 'demo',
    email: 'demo@demo.demo'
  };


  /**
   * Some of the API methods are access restricted using JWT
   * so create a default user (demo/demo)
   */
  before(function(done) {
    var exec = require('child_process').exec;

    this.timeout(10000);
    exec('grunt util:createUser --default', done);
  });


  describe('GET /api', function() {
    it('should respond with json', function(done) {
      request(app)
        .get('/api')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
      });
  });


  describe('Login', function() {
    it('Should return a JWT when supplying valid user credentials', function(done) {
      request(app)
        .post('/api/login')
        .send({ username: defaultUser.username, password: defaultUser.password })
        .expect(200)
        .end(function(err, res) {
          expect(objectid.isValid(res.body._id)).to.be.true;
          expect(res.body.username).to.equal(defaultUser.username);
          expect(res.body.email).to.equal(defaultUser.email);
          expect(res.body.token_exp).to.be.a('number');
          expect(res.body.token_iat).to.be.a('number');
          expect(res.body.token).to.be.a('string');
          done();
        });
    });


    it('Should return a 401 error when supplying a valid username with a wrong password', function(done) {
      request(app)
        .post('/api/login')
        .send({ username: defaultUser.username, password: 'whatever' })
        .expect(401)
        .end(done);
    });


    it('Should return a 401 error when supplying a non existing user credentials', function(done) {
      request(app)
        .post('/api/login')
        .send({ username: 'nonExistingUsername', password: 'whatever' })
        .expect(401)
        .end(done);
    });


    it('Should return a 401 error if the username is not supplied', function(done) {
      request(app)
        .post('/api/login')
        .send({ password: 'whatever' })
        .expect(401)
        .end(done);
    });


    it('Should return a 401 error if the password is not supplied', function(done) {
      request(app)
        .post('/api/login')
        .send({ username: defaultUser.username })
        .expect(401)
        .end(done);
    });
  });


  describe('Logout', function() {
    it('Should return a 401 error if no valid auth token is supplied', function(done) {
      request(app)
        .get('/api/logout')
        .set('Authorization', 'Bearer randomStringTotallyFakeToken')
        .expect(401)
        .end(done);
    });


    it('Should expire the JWT', function(done) {
      // 'login' first
      request(app)
        .post('/api/login')
        .send({ username: defaultUser.username, password: defaultUser.password })
        .expect(200)
        .end(function(err, res) {

          var token = res.body.token;

          // logout
          request(app)
            .get('/api/logout')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function(err, res) {
              // verify
              request(app)
                .get('/api/verify')
                .set('Authorization', 'Bearer ' + token)
                .expect(401)
                .end(done);

            });
        });
    });


    it('Should return a 401 error the JWT is already expired', function(done) {
      // 'login' first
      request(app)
        .post('/api/login')
        .send({ username: defaultUser.username, password: defaultUser.password })
        .expect(200)
        .end(function(err, res) {

          var token = res.body.token;

          // logout
          request(app)
            .get('/api/logout')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function(err, res) {
              // logout again
              request(app)
                .get('/api/logout')
                .set('Authorization', 'Bearer ' + token)
                .expect(401)
                .end(done);

            });
        });
    });
  });


  describe('Verify', function() {
    it('Should return a success message if a valid JWT is supplied', function(done) {
      // 'login' first
      request(app)
        .post('/api/login')
        .send({ username: defaultUser.username, password: defaultUser.password })
        .expect(200)
        .end(function(err, res) {

          // verify
          request(app)
            .get('/api/verify')
            .set('Authorization', 'Bearer ' + res.body.token)
            .expect(200)
            .end(done);

        });
    })


    it('Should return a 401 if a non valid JWT is supplied', function(done) {
      request(app)
        .get('/api/verify')
        .set('Authorization', 'Bearer randomStringTotallyFakeToken')
        .expect(401)
        .end(done);
    });
  });

});
