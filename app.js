/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';


// BASE SETUP
// =============================================================================
var
  express    = require('express'),
  app        = express(),
  bodyParser = require('body-parser'),
  router     = express.Router(),
  publicDir  = __dirname + '/../../dist',
  port       = process.env.PORT || 5000;


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to serve static files from the dist directory
app.use(express.static(publicDir));

// root
app.get('/', function(req, res) {
    res.sendfile(publicDir + '/index.html');
});


// API ROUTES
// =============================================================================

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
