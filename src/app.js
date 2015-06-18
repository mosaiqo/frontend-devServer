/* global require, module, process, exports, console, __dirname */
/* jshint -W097 */
'use strict';

var
  debug      = require('debug')('MosaiqoApp:' + process.pid),
  fs         = require('fs'),
  errors     = require('./lib/errors');


// New Relic
/* istanbul ignore next */
if (process.env.NEW_RELIC_ENABLED) {
  require('newrelic');
  debug('Starting New Relic monitoring');
}


var
  express    = require('express'),
  bodyParser = require('body-parser'),

  publicDir  = process.env.APP_PUBLIC_DIR,
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
app.use(function(err, req, res, next) {

  var code, message, resp = {};

  /* istanbul ignore next */
  switch (err.name) {
    case 'UnauthorizedError':
      code    = err.status;
      message = err.message;
      break;
    case 'HttpNotFoundError':
      code    = err.code;
      message = 'Not found';
      break;
    case 'BadRequestError':
    case 'HttpUnauthorized':
      code    = err.code;
      message = err.message;
      break;
    case 'ValidationError':
      code    = 422;
      message = 'Validation Error';
      resp.errors  = {};

      for (var errName in err.errors) {
        if(errors[errName]) {
          resp.errors[errName].push(err.errors[errName].message);
        } else {
          resp.errors[errName] = [err.errors[errName].message];
        }
      }
      break;
    default:
      code    = 500;
      message = 'Internal Server Error';
      break;
  }

  resp.error = {
    code:    code,
    message: message
  };

  return res.status(code).json(resp);

});

// START THE SERVER
// =============================================================================
app.listen(port);
debug('Server running on port ' + port);
