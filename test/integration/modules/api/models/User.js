/* global require, module, process, console, describe, it, before, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';

var
  // paths
  projectRootDir = '../../../../../',
  appRootDir     = projectRootDir + 'src/',

  // test dependencies
  mocha             = require('mocha'),
  expect            = require('chai').expect,
  faker             = require('faker'),
  mongoose          = require('mongoose'),
  requireHelper     = require(projectRootDir + 'test/require_helper'),
  mongoConfigParser = require(appRootDir + 'lib/mongoConfigParser'),

  // file being tested
  User              = requireHelper('modules/api/models/User');




describe('User model', function() {

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


  it('should save user', function(done) {
    var userdata = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email:    faker.internet.email()
    };

    var user = new User(userdata);

    user.save(function(err, user) {
      if(err) done(err);
      expect(user.username).to.equal(userdata.username);
      expect(user.email).to.equal(userdata.email);
      done();
    });
  });


  it('should store the password encrypted', function(done) {
    var userdata = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email:    faker.internet.email()
    };

    var user = new User(userdata);

    // user is new
    user.save(function(err, user) {
      if(err) done(err);
      expect(user.password).to.not.equal(userdata.password);
      user.comparePassword(userdata.password, function(err, match) {
        expect(match).to.true;
      })

      // editing an existing user, assign a new password
      var newPassword = faker.internet.password() + '1234';
      user.password = newPassword;

      user.save(function(err, user) {
        if(err) done(err);
        expect(user.password).to.not.equal(newPassword);

        user.comparePassword(newPassword, function(err, match) {
          expect(match).to.true;
        })

        done();
      });
    });
  });


  it('should require a username', function(done) {
    var userdata = {
      password: faker.internet.password(),
      email:    faker.internet.email()
    };

    var user = new User(userdata);

    user.save(function(err, user) {
      if(err) {
        expect(err.errors).to.have.property('username');
        done();
      } else {
        done(new Error('Model saved successfully'));
      }
    });
  });


  it('should require a email', function(done) {
    var userdata = {
      username: faker.internet.userName(),
      password: faker.internet.password()
    };

    var user = new User(userdata);

    user.save(function(err, user) {
      if(err) {
        expect(err.errors).to.have.property('email');
        done();
      } else {
        done(new Error('Model saved successfully'));
      }
    });
  });


  it('should require a password', function(done) {
    var userdata = {
      username: faker.internet.userName(),
      email:    faker.internet.email()
    };

    var user = new User(userdata);

    user.save(function(err, user) {
      if(err) {
        expect(err.errors).to.have.property('password');
        done();
      } else {
        done(new Error('Model saved successfully'));
      }
    });
  });


  it('should require a unique username', function(done) {
    var
      userdata = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email:    faker.internet.email()
      },
      user1 = new User(userdata),
      user2 = new User(userdata);

    user1.save(function(err, user) {
      if(err) done(err);

      user2.save(function(err, user) {
        if(err) {
          done();
        } else {
          done(new Error('Model saved successfully'));
        }
      });
    });
  });

});

