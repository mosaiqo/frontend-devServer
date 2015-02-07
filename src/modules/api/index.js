/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  fs         = require('fs'),
  express    = require('express'),
  mongoose   = require('mongoose'),
  rootDir    = './../../../',
  routesDir  = './routes/';


if(process.env.APP_DIR_FOR_CODE_COVERAGE) {
 rootDir += '../../../../';
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
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});


// load the routes
fs.readdirSync(routesDir).forEach(function(file) {
  var route = routesDir + file.substr(0, file.indexOf('.'));
  console.log('Adding route:' + route);
  require(route)(router);
});


module.exports = router;
