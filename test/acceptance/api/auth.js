/* global require, module, process, console, describe, it, before, __dirname, setTimeout */
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




describe('API authentication', function() {

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


  describe('Login', function() {
    it('Should return a JWT when supplying valid user credentials', function(done) {
      request(app)
        .post('/api/auth')
        .send({ username: defaultUser.username, password: defaultUser.password })
        .expect(200)
        .end(function(err, res) {
          expect(objectid.isValid(res.body.userId)).to.be.true;
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
        .post('/api/auth')
        .send({ username: defaultUser.username, password: 'whatever' })
        .expect(401)
        .end(done);
    });


    it('Should return a 401 error when supplying a non existing user credentials', function(done) {
      request(app)
        .post('/api/auth')
        .send({ username: 'nonExistingUsername', password: 'whatever' })
        .expect(401)
        .end(done);
    });


    it('Should return a 401 error if the username is not supplied', function(done) {
      request(app)
        .post('/api/auth')
        .send({ password: 'whatever' })
        .expect(401)
        .end(done);
    });


    it('Should return a 401 error if the password is not supplied', function(done) {
      request(app)
        .post('/api/auth')
        .send({ username: defaultUser.username })
        .expect(401)
        .end(done);
    });
  });


  describe('Logout', function() {
    it('Should return a 401 error if no valid auth token is supplied', function(done) {
      request(app)
        .delete('/api/auth/randomStringTotallyFakeToken')
        .set('Authorization', 'Bearer randomStringTotallyFakeToken')
        .expect(401)
        .end(done);
    });


    it('Should expire the JWT', function(done) {
      // 'login' first
      request(app)
        .post('/api/auth')
        .send({ username: defaultUser.username, password: defaultUser.password })
        .expect(200)
        .end(function(err, res) {

          var token = res.body.token;

          // logout
          request(app)
            .delete('/api/auth/' + token)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function(err, res) {
              // verify
              request(app)
                .get('/api/auth/' + token)
                .set('Authorization', 'Bearer ' + token)
                .expect(401)
                .end(done);

            });
        });
    });


    it('Should return a 401 error the JWT is already expired', function(done) {
      // 'login' first
      request(app)
        .post('/api/auth')
        .send({ username: defaultUser.username, password: defaultUser.password })
        .expect(200)
        .end(function(err, res) {

          var token = res.body.token;

          // logout
          request(app)
            .delete('/api/auth/' + token)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function(err, res) {
              // logout again
              request(app)
                .delete('/api/auth/' + token)
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
        .post('/api/auth')
        .send({ username: defaultUser.username, password: defaultUser.password })
        .expect(200)
        .end(function(err, res) {

          var token = res.body.token;

          // verify
          request(app)
            .get('/api/auth/' + token)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(done);

        });
    });


    it('Should return a 401 if a non valid JWT is supplied', function(done) {
      request(app)
        .get('/api/auth/randomStringTotallyFakeToken')
        .set('Authorization', 'Bearer randomStringTotallyFakeToken')
        .expect(401)
        .end(done);
    });
  });


  describe('Token-refresh', function() {

    var tokenAboutToExpire = { token: null, exp: null };

    before(function(done) {
      request(app)
        .post('/api/auth')
        .send({ username: defaultUser.username, password: defaultUser.password })
        .end(function(err, res) {
          tokenAboutToExpire.token = res.body.token;
          tokenAboutToExpire.exp   = res.body.token_exp;
          done();
        });
    });


    it('Should return a 401 if thre\'s no auth header', function(done) {
      request(app)
        .get('/api/token-renew')
        .expect(401)
        .end(done);
    });


    it('Should return a 401 if the supplied token is not valid or has expired', function(done) {
      request(app)
        .get('/api/token-renew')
        .set('Authorization', 'Bearer randomStringTotallyFakeToken')
        .expect(401)
        .end(done);
    });


    it('Should issue a new token with a new expiry date', function(done) {
      this.timeout(50000);

      setTimeout(function () {

        request(app)
        .get('/api/token-renew')
        .set('Authorization', 'Bearer ' + tokenAboutToExpire.token)
        .expect(200)
        .end(function(err, res) {
          var token = res.body.token;

          expect(objectid.isValid(res.body.userId)).to.be.true;
          expect(res.body.username).to.equal(defaultUser.username);
          expect(res.body.email).to.equal(defaultUser.email);
          expect(res.body.token_exp).to.be.a('number');
          expect(res.body.token_iat).to.be.a('number');
          expect(token).to.be.a('string');

          expect(token).to.not.equal(tokenAboutToExpire.token);
          expect(res.body.token_exp).to.be.at.least(tokenAboutToExpire.exp);

          request(app)
            .get('/api/auth/' + token)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(done);
        });

      }, 2000);
    });


    it('Should expire the old token when renewing it', function(done) {
      request(app)
        .get('/api/auth/' + tokenAboutToExpire.token)
        .set('Authorization', 'Bearer ' + tokenAboutToExpire.token)
        .expect(401)
        .end(done);
    });
  });

});
