/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';


// BASE SETUP
// =============================================================================
var
  express    = require('express'),
  bodyParser = require('body-parser'),

  rootDir    = __dirname + '/../../',
  publicDir  = rootDir + 'dist/',
  port       = process.env.PORT || 5000,
  app        = express();


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to serve static files from the dist directory
app.use(express.static(publicDir));

// root
app.get('/', function(req, res) {
    res.sendfile(publicDir + 'index.html');
});


// MONGO CONF.
// =============================================================================
var mongoConfigParser = require('./lib/mongoConfigParser');

var mongoConn = new mongoConfigParser()
  .setEnvDir( rootDir + 'db/mongo/env' )
  .getConnectionString();

console.log(mongoConn);



// API ROUTES
// =============================================================================

var router = express.Router();

// test route to make sure everything is working (accessed at GET http://localhost:PORT/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});


// more routes for our API will happen here

// REGISTER THE ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running on port ' + port);
