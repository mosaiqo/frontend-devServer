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

  /**
   * @api {post} /api/auth Login
   * @apiName Login
   * @apiGroup Auth
   * @apiDescription Authenticates the user and returns the auth token. The token
   *                 is also saved to a Redis store so it can be revoked at any time.
   *
   * @apiExample Example usage:
   * curl -4 -i http://localhost:9000/api/auth --data "username=demo&password=demo"
   *
   * @apiParam {String} username User name.
   * @apiParam {String} password User password.
   *
   * @apiSuccess {String} _id User id.
   * @apiSuccess {String} username Username.
   * @apiSuccess {String} email User email.
   * @apiSuccess {String} token JWT.
   * @apiSuccess {Number} token_exp Token expiry date (Unix time).
   * @apiSuccess {Number} token_iat Token issue date (Unix time).
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "_id": "54ee6175465eaee35cd237ed",
   *       "username": "demo",
   *       "email": "demo@demo.demo",
   *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTQ0ODYsImV4cCI6MTQyNzgxODA4Nn0.pZVBE_GKvJUr4BI7BDeTmIIy9gQ2p3tlrG2pcMcjm3U",
   *       "token_exp": 1427818086,
   *       "token_iat": 1427814486
   *     }
   *
   * @apiError (401) {Boolean} error Error.
   * @apiError (401) {Number} errorCode Error code.
   * @apiError (401) {String} message Error description.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "error": true,
   *       "errorCode": 401,
   *       "message": "Invalid username or password"
   *     }
   */
  router.route('/auth').post(authenticate, function(req, res, next) {
    return res.status(200).json(req.user);
  });


  /**
   * @api {delete} /api/auth/{token} Logout
   * @apiName Logout
   * @apiGroup Auth
   * @apiDescription Deauthenticates the user by invalidating the token.
   *
   * @apiExample Example usage:
   * curl -4 -i -X DELETE http://localhost:9000/api/auth/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8 --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
   *
   * @apiHeader {String} Authorization Auth. header containing the token.
   *
   * @apiSuccess {String} message Logout success message.
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "User has been successfully logged out"
   *     }
   *
   * @apiError (401) {Boolean} error Error.
   * @apiError (401) {Number} errorCode Error code.
   * @apiError (401) {String} message Error description.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "error": true,
   *       "errorCode": 401,
   *       "message": "invalid_token"
   *     }
   */
  router.route('/auth/:token').delete(function(req, res, next) {

    jwtAuth.retrieve(req.params.token, function(err, data) {
      /* istanbul ignore next */
      if (err) {
        return next( new errors.Unauthorized('User not found') );
      }

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
  });


  /**
   * @api {get} /api/token-renew Token renewal
   * @apiName TokenRenew
   * @apiGroup Auth
   * @apiDescription Creates a new token with a new expiry date without requiring the user to send again its credentials.
   *
   * @apiExample Example usage:
   * curl -4 -i http://localhost:9000/api/token-renew --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
   *
   * @apiHeader {String} Authorization Auth. header containing the token.
   *
   * @apiSuccess {String} _id User id.
   * @apiSuccess {String} username Username.
   * @apiSuccess {String} email User email.
   * @apiSuccess {String} token JWT.
   * @apiSuccess {Number} token_exp Token expiry date (Unix time).
   * @apiSuccess {Number} token_iat Token issue date (Unix time).
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "_id": "54ee6175465eaee35cd237ed",
   *       "username": "demo",
   *       "email": "demo@demo.demo",
   *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTQ0ODYsImV4cCI6MTQyNzgxODA4Nn0.pZVBE_GKvJUr4BI7BDeTmIIy9gQ2p3tlrG2pcMcjm3U",
   *       "token_exp": 1427818086,
   *       "token_iat": 1427814486
   *     }
   *
   * @apiError (401) {Boolean} error Error.
   * @apiError (401) {Number} errorCode Error code.
   * @apiError (401) {String} message Error description.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "error": true,
   *       "errorCode": 401,
   *       "message": "invalid_token"
   *     }
   */
  router.route('/token-renew').get(function(req, res, next) {

    User.findOne({
      username: req.user.username
    }, function (err, user) {

      /* istanbul ignore next */
      if (err || !user) {
        return next( new errors.Unauthorized('User not found') );
      }

      jwtAuth.create(user, req, res, function() {
        jwtAuth.expire(req.headers);
        return res.status(200).json(req.user);
      });

    });
  });


  /**
   * @api {get} /api/auth/:token Token verification
   * @apiName Verify
   * @apiGroup Auth
   * @apiDescription Verifies if the token is valid and has not expired.
   *
   * @apiExample Example usage:
   * curl -4 -i http://localhost:9000/api/auth/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8 --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
   *
   * @apiHeader {String} Authorization Auth. header containing the token.
   *
   * @apiSuccess {String} message Auth. verification result.
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "Token is valid"
   *     }
   *
   * @apiError (401) {Boolean} error Error.
   * @apiError (401) {Number} errorCode Error code.
   * @apiError (401) {String} message Error description.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Unauthorized
   *     {
   *       "error": true,
   *       "errorCode": 401,
   *       "message": "invalid_token"
   *     }
   */
  router.route('/auth/:token').get(function(req, res, next) {
    jwtAuth.retrieve(req.params.token, function(err, data) {
      /* istanbul ignore next */
      if (err) {
        return next( new errors.Unauthorized('Token not found') );
      }

      return res.status(200).json({'message': 'Token is valid'});
    });
  });

};


module.exports.authenticate = authenticate;
