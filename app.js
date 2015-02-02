/* global require, module, process, exports, console, __dirname */
/* jshint -W097 */
'use strict';

var
  fs         = require('fs'),
  express    = require('express'),
  bodyParser = require('body-parser'),

  rootDir    = __dirname + '/../../',
  publicDir  = rootDir + 'dist/',
  port       = process.env.PORT || 5000,
  app        = exports.app = express();


// BASE SETUP
// =============================================================================

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


// FAKE API (the real on will be implemented using Laravel)
// =============================================================================
var API = require('./modules/api');

// Register the routes
// all of our routes will be prefixed with /api
app.use('/api', API);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running on port ' + port);
