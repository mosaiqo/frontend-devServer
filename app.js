'use strict';

// simple express server
var
  express   = require('express'),
  app       = express(),
  router    = express.Router(),
  publicDir = __dirname + '/../../dist';

app.use(express.static(publicDir));
app.get('/', function(req, res) {
    res.sendfile(publicDir + '/index.html');
});

app.listen(process.env.PORT || 5000);
