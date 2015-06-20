/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  _             = require('lodash'),
  errors        = require('src/lib/errors'),
  respFormatter = require('src/lib/responseFormatter'),
  jwtAuth       = require('src/lib/jwtAuth'),
  User          = require('../models/User'),
  debug         = require('debug')('MosaiqoApp:AuthController:' + process.pid);



var AuthController = {

  login: function(req, res, next) {
    // auth handling implemented in the Authenticated middleware
    return res.status(200).json( respFormatter(req.user) );
  },


  logout: function(req, res, next) {

    jwtAuth.retrieve(req.params.token, function(err, data) {
      /* istanbul ignore next */
      if (err) {
        return next( new errors.Unauthorized('User not found') );
      }

      /* istanbul ignore else */
      if (jwtAuth.expire(req.headers)) {
        delete req.user;
        return res.status(200).json(respFormatter({
          'message': 'User has been successfully logged out'
        }));
      } else {
        return next(new errors.Unauthorized());
      }
    });
  },


  tokenRenew: function(req, res, next) {

    /* istanbul ignore next */
    if(req.params.token !== req.user.token) {
      return next(new errors.Unauthorized());
    }

    User.findOne({
      username: req.user.username
    }, function (err, user) {

      /* istanbul ignore next */
      if (err || !user) {
        return next( new errors.Unauthorized('User not found') );
      }

      jwtAuth.create(user, req, res, function() {
        jwtAuth.expire(req.headers);
        return res.status(200).json( respFormatter(req.user) );
      });

    });

  },


  tokenVerify: function(req, res, next) {
    /* istanbul ignore next */
    if(req.params.token !== req.user.token) {
      return next(new errors.Unauthorized());
    }

    return res.status(200).json( respFormatter({'message': 'Token is valid'}) );
  }

};


module.exports = AuthController;
