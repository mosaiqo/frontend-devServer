/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

module.exports = function(data, meta, errors) {

  if(errors) {
    return {
      error: errors
    };
  } else {

    return {
      meta: meta || {},
      data: data || {}
    };
  }
};
