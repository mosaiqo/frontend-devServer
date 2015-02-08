/* global require, module, process, exports, console, __dirname */
/* jshint -W097 */
'use strict';

var
  fs        = require('fs'),
  express   = require('express'),
  publicDir = process.env.appPublicDir;

module.exports = {
  root: function(req, res) {
    res.sendFile(publicDir + '/index.html');
  }
};
