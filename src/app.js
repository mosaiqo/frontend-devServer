/* global require, module, process, exports, console, __dirname */
/* jshint -W097 */
'use strict';

// Set the base path for the requires
// (The conditional path is necessary in order
// to run the tests on the instrumented code)
/* istanbul ignore next */
if(process.env.APP_DIR_FOR_CODE_COVERAGE) {
  require('../../../../config/require');
} else {
  require('../config/require');
}

// New Relic
/* istanbul ignore next */
if (process.env.NEW_RELIC_ENABLED && !process.env.DEV) {
  require('newrelic');
  debug('Starting New Relic monitoring');
}




var
  debug      = require('debug')('MosaiqoApp:' + process.pid),
  fs         = require('fs'),
  errors     = require('src/lib/errors'),

  express    = require('express'),
  bodyParser = require('body-parser'),
  cors       = require('cors'),

  publicDir  = process.env.APP_PUBLIC_DIR,
  port       = process.env.PORT || 5000;


// BASE SETUP
// =============================================================================

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// enable CORS
app.use(cors({ origin: '*' }));
app.options('*', cors()); //  enable pre-flight across-the-board

// configure app to use response-time to detect possible bottlenecks or other issues
app.use(require('response-time')());
app.use(require('compression')());

// configure app to serve static files from the dist directory
app.use(express.static(publicDir));

// setup the routes
var routeHandlers = require('./routeHandlers');
app.get('/', routeHandlers.root);


// SETUP THE PAGINATION MIDDLEWARE
// =============================================================================
var paginate = require('express-paginate');

app.use(paginate.middleware(20, 200));


// FAKE API (the real on will be implemented using Laravel)
// =============================================================================
var API = require('./modules/api');

// Register the routes
// all of our routes will be prefixed with /api
app.use('/api', API);


// ERROR HANDLING
// =============================================================================

// throw a 404 error if the route does not match anything
app.all('*', function (req, res, next) {
    next(new errors.NotFound());
});

// generic error handler
app.use(require('./errorHandlers').middleware);

// START THE SERVER
// =============================================================================
app.listen(port);
debug('Server running on port ' + port);
