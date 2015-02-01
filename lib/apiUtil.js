/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

module.exports = {
  getErrorResponse : function(code, msg, err) {
    if(!msg) {
      switch(code) {
        case 500:
          msg = 'Internal server error';
          break;
        case 404:
          msg = 'Not found';
          break;
      }
    }

    var ret = {
      error     : true,
      errorCode : code,
      message   : msg
    };

    if(err) {
      ret.error = err;
    }

    return ret;
  }
};