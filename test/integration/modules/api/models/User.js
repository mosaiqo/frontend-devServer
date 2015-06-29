'use strict';

var
  // test dependencies
  mocha             = require('mocha'),
  expect            = require('chai').expect,
  faker             = require('faker'),
  mongoose          = require('mongoose'),
  requireHelper     = require('test/require_helper'),
  mongoConfigParser = require('src/lib/mongoConfigParser'),

  // file being tested
  User              = requireHelper('modules/api/models/User');




describe('User model', function() {

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


  it('should save the user', function(done) {
    var userdata = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email:    faker.internet.email()
    };

    var user = new User(userdata);

    user.save(function(err, user) {
      if(err) { done(err); }
      expect(user.username).to.equal(userdata.username);
      expect(user.email).to.equal(userdata.email);
      user.remove();
      done();
    });
  });


  it('should transform the virtual attributes when /saving/fetching', function(done) {
    var userdata = {
      id :      '000000000000000000000001',
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email:    faker.internet.email()
    };

    var user = new User(userdata);

    user.save(function(err, user) {
      var userJSON = user.toJSON();
      expect(userJSON).to.have.property('id');
      expect(userJSON).to.not.have.property('_id');
      expect(userJSON).to.not.have.property('password');
      user.remove();

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
      if(err) { done(err); }
      expect(user.password).to.not.equal(userdata.password);
      user.comparePassword(userdata.password, function(err, match) {
        expect(match).to.true;
      });

      // editing an existing user, assign a new password
      var newPassword = faker.internet.password() + '1234';
      user.password = newPassword;

      user.save(function(err, user) {
        if(err) { done(err); }
        expect(user.password).to.not.equal(newPassword);

        user.comparePassword(newPassword, function(err, match) {
          expect(match).to.true;
        });

        user.remove();

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
        user.remove();
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
        user.remove();
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
        user.remove();
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
      if(err) { done(err); }

      user2.save(function(err, user) {
        if(err) {
          user1.remove();
          done();
        } else {
          user1.remove();
          user2.remove();
          done(new Error('Model saved successfully'));
        }
      });
    });
  });

});
