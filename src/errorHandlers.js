/* global require, module, process, console */
/* jshint -W097 */
'use strict';

var HTTPerrors = [
  100,101,
  200,201,202,203,204,205,206,
  300,301,302,303,304,305,306,307,
  400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,
  500,501,502,503,504,505
];

var errors = {
  default: {
    code:    500,
    message: 'Internal Server Error'
  },
  notFound: {
    code:    404,
    message: 'Not found'
  },
  validation: {
    code:    422,
    message: 'Validation Error'
  }
};


/**
 * Error code normalization
 *
 * Some errors have a code and status attributes, where code
 * is the error type and status is the number. This normalizes
 * that weirdness.
 *
 * @param  {Object} err The error object
 * @return {Number}     The error code
 */
var normalizeErrorCode = function(err) {
  var code = err.code;

  if(isNaN(err.code)) {
    code = (err.status && !isNaN(err.status)) ?
      err.status : /* istanbul ignore next */ errors.default.code;
  }

  return code;
};


/**
 * Mongoose does not throw validation errors for dupplicate values on
 * fields with a 'unique' index. Instead it throws a 11000 error with
 * an obscure description not suitable to be shown to the users.
 * This returns the field with the dupplicate key so a more user friendly
 * validation error can be thrown.
 *
 * @param  {String} errMessage The error message from Mongo
 * @return {String}            The name of the field that triggered the error
 */
var getPathNameFromMongoUniqueIndexError = function(errMessage) {
  // Try to get the problematic field (it's a bit hacky because there key might be a composite one)
  //
  // The error message should be something like:
  //   E11000 duplicate key error index: dbName.collection.$errPath_1 dup key: { : ObjectId('__id__'), : "someValue" }
  //
  var field = errMessage.split('.$')[1];

  field = field.split(' dup key')[0];                 // -> 'errPath_1 dup key'
  field = field.substring(0, field.lastIndexOf('_')); // -> 'errPath'

  // if this is a compound key, probably is something like
  // 'owner_1_errPath_1'
  // where owner is the client (currently there are no other types of compound keys
  // that might trigger this err). Try to clean it up.
  field.split('_').filter(function(k) {
    return ['1', '-1', 'owner'].indexOf(k) === -1;
  }).join(' ');

  return field;
};


/**
 * Error handling middleware
 */
var appErrorHandler = function(err, req, res, next) {

  var code, message, resp = { meta: {} };

  // normalize the code
  if(err.code) {
    err.code = normalizeErrorCode(err);
  }


  if(err.code && HTTPerrors.indexOf(err.code) > -1) {  // custom HTTP errors
    code = err.code;

    if(err.message) {
      message = err.message;

    } else {
      message = (code === 404) ?
        errors.notFound.message : /* istanbul ignore next */ errors.default.message;
    }

  } else if(err.name === 'CastError' && err.path === '_id') {
    code    = errors.notFound.code;
    message = errors.notFound.message;

  } else if(err.code === 11000) { // mongo error dupplicate unique index
    code    = errors.validation.code;
    message = errors.validation.message;

    var field = getPathNameFromMongoUniqueIndexError(err.message);

    if(field) {
      resp.errors = {};
      resp.errors[field] = 'Must be unique';
    }

  } else if(err.name === 'ValidationError') {
    code    = errors.validation.code;
    message = errors.validation.message;

    resp.errors = {};

    for (var errName in err.errors) {
      /* istanbul ignore if */
      if(errors[errName]) {
        resp.errors[errName].push(err.errors[errName].message);
      } else {
        resp.errors[errName] = [err.errors[errName].message];
      }
    }

  } else {
    code    = errors.default.code;
    message = errors.default.message;
  }


  // build the response
  resp.error = {
    code:    code,
    message: message
  };

  return res.status(code).json(resp);
};


// export everything so it can be tested
module.exports = {
  HTTPerrors: HTTPerrors,
  errors: errors,
  normalizeErrorCode: normalizeErrorCode,
  middleware: appErrorHandler
};
