/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  fs         = require('fs'),
  express    = require('express'),
  mongoose   = require('mongoose'),
  debug      = require('debug')('MosaiqoApp:API:' + process.pid),
  jwt        = require('express-jwt'),
  jwtAuth    = require('./../../lib/jwtAuth'),
  errors     = require('./../../lib/errors'),
  rootDir    = __dirname + '/../../../',
  routesDir  = __dirname + '/routes/';


/* istanbul ignore next */
if(process.env.APP_DIR_FOR_CODE_COVERAGE) {
 rootDir += '../../../';
}


// MONGO CONF.
// =============================================================================
var mongoConfigParser = require('../../lib/mongoConfigParser');

var mongoConn = new mongoConfigParser().setEnv({
  host     : process.env.MONGO_HOST,
  port     : process.env.MONGO_PORT,
  user     : process.env.MONGO_USER,
  password : process.env.MONGO_PASSWORD,
  database : process.env.MONGO_DATABASE
});

/* istanbul ignore next */
mongoose.connection.on('error', function () {
    debug('Mongoose connection error');
});
mongoose.connection.once('open', function callback() {
    debug('Mongoose connected to the database');
});

// connect
mongoose.connect(mongoConn.getConnectionString(), mongoConn.getConnectionOptions());


// SETUP THE MODULE ROUTES
// =============================================================================
var router = express.Router();

// auth free routes
var excluded = {path: [
  /api\/?$/i,
  /api\/login\/?$/i
]};

// Setup the authentication using JWT
router.use( jwt({ secret: process.env.JWT_SECRET }).unless(excluded) );
router.use( jwtAuth.middleware().unless(excluded) );


// -- API ROUTES --

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

module.exports = router;
