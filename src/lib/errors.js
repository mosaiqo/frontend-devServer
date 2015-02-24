/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

require('extend-error');

module.exports = {
  App :         Error.extend('AppError',          500),
  NotFound:     Error.extend('HttpNotFoundError', 404),
  Unauthorized: Error.extend('HttpUnauthorized',  401)
};
