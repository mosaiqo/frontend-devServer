/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  _          = require('lodash'),
  errors     = require('../../../lib/errors'),
  User       = require('../models/User'),
  jwtAuth    = require('./../../../lib/jwtAuth'),
  debug      = require('debug')('MosaiqoApp:routes:auth:' + process.pid);


// AUTHENTICATION MIDDLEWARE
// =============================================================================
var authenticate = function (req, res, next) {

  var
    username = req.body.username,
    password = req.body.password;


  if (_.isEmpty(username) || _.isEmpty(password)) {
    return next( new errors.Unauthorized('Invalid username or password') );
  }


  process.nextTick(function () {
    User.findOne({
      username: username
    }, function (err, user) {

      if (err || !user) {
        return next( new errors.Unauthorized('Invalid username or password') );
      }

      user.comparePassword(password, function (err, isMatch) {
        if (isMatch && !err) {
          debug('User authenticated, generating token');
          jwtAuth.create(user, req, res, next);
        } else {
          return next( new errors.Unauthorized('Invalid username or password') );
        }
      });
    });
  });
};


// AUTH RELATED ROUTES
// =============================================================================
module.exports = function(router) {

  router.route('/login').post(authenticate, function(req, res, next) {
    return res.status(200).json(req.user);
  });

  router.route('/logout').get(function(req, res, next) {
    /* istanbul ignore else */
    if (jwtAuth.expire(req.headers)) {
      delete req.user;
      return res.status(200).json({
        'message': 'User has been successfully logged out'
      });
    } else {
      return next(new errors.Unauthorized());
    }
  });

  router.route('/verify').get(function(req, res, next) {
    return res.status(200).json({'message': 'Token is valid'});
  });

};


module.exports.authenticate = authenticate;
