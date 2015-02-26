/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  mongoose = require('mongoose'),
  Schema   = mongoose.Schema,
  bcrypt   = require('bcryptjs');


var UserSchema = new Schema({

  username: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  }

}, {

  toObject: {
    virtuals: true
  }, toJSON: {
    virtuals: true
  }

});

// Bcrypt middleware on UserSchema
// Hashes the password before saving the model to the database
UserSchema.pre('save', function (next) {
  var user = this;

  /* istanbul ignore else */
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      /* istanbul ignore next */
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, function (err, hash) {
        /* istanbul ignore next */
        if (err) {
          return next(err);
        }

        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

//Password verification
UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    /* istanbul ignore next */
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};


module.exports = mongoose.model('User', UserSchema);
