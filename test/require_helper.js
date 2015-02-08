/* global require, module, process, console, describe, it, before, __dirname */
/* jshint -W097 */
/* jshint expr: true */
'use strict';
module.exports = function (path) {
  return require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../src/') + path);
};
