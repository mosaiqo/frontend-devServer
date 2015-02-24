/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  fs         = require('fs'),
  express    = require('express'),
  mongoose   = require('mongoose'),
  debug      = require('debug')('API'),
  rootDir    = __dirname + '/../../../',
  routesDir  = __dirname + '/routes/';


/* istanbul ignore next */
if(process.env.APP_DIR_FOR_CODE_COVERAGE) {
 rootDir += '../../../';
}


// MONGO CONF.
// =============================================================================
var mongoConfigParser = require('../../lib/mongoConfigParser');

var mongoConn = new mongoConfigParser()
  .setEnvDir( rootDir + 'db/mongo/env' );

// connect
mongoose.connect(mongoConn.getConnectionString(), mongoConn.getConnectionOptions());


// API ROUTES
// =============================================================================
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:PORT/api)
router.get('/', function(req, res, next) {
  res.json({ message: 'hooray! welcome to our api!' });
});


// load the routes
fs.readdirSync(routesDir).forEach(function(file) {
  var route = routesDir + file.substr(0, file.indexOf('.'));
  debug('Adding route:' + route);
  require(route)(router);
});


/*
 * Generic error handler
 */
router.use(function (err, req, res, next) {

  var code, message;

  switch (err.name) {
    case 'UnauthorizedError':
      code    = err.code;
      message = undefined;
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
    default:
      code    = 500;
      message = 'Internal Server Error';
      break;
  }

  return res.status(code).json({
    error     : true,
    errorCode : code,
    message   : message
  });

});


module.exports = router;
