/* global require, module, process, exports, console, __dirname */
/* jshint -W097 */
'use strict';

var publicDir = process.env.appPublicDir;

module.exports = {
  root: function(req, res) {
    res.sendfile(publicDir + '/index.html');
  }
};
