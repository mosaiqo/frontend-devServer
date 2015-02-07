/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  fs          = require('fs'),
  rootDir     = __dirname + '/',
  fixturesDir = __dirname + '/test/fixtures/';


// MONGO CONF:
// Get the connection params for the mongo instance
// =============================================================================
var mongoConfigParser = require('./lib/mongoConfigParser');

var mongoConn = new mongoConfigParser()
  .setEnvDir( rootDir + 'db/mongo/env' );

console.log('Populating DB');
console.log('----------------------------------');
console.log(mongoConn.getConnectionString());
