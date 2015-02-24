/* global require, module, process, exports, console, __dirname */
/* jshint -W097 */
'use strict';

var
  debug      = require('debug')('MosaiqoApp'),
  fs         = require('fs');


// New Relic
/* istanbul ignore next */
if (process.env.NEW_RELIC_ENABLED) {
  require('newrelic');
  debug('Starting New Relic monitoring');
}


var
  express    = require('express'),
  bodyParser = require('body-parser'),

  publicDir  = process.env.appPublicDir,
  port       = process.env.PORT || 5000,
  app        = exports.app = express();


// BASE SETUP
// =============================================================================

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to use response-time to detect possibl bottlenecks or other issues
app.use(require('response-time')());
app.use(require('compression')());

// configure app to serve static files from the dist directory
app.use(express.static(publicDir));

// setup the routes
var routeHandlers = require('./routeHandlers');
app.get('/', routeHandlers.root);


// FAKE API (the real on will be implemented using Laravel)
// =============================================================================
var API = require('./modules/api');

// Register the routes
// all of our routes will be prefixed with /api
app.use('/api', API);


// START THE SERVER
// =============================================================================
app.listen(port);
debug('Server running on port ' + port);
