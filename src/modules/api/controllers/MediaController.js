/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  respFormatter = require('src/lib/responseFormatter'),
  errors        = require('src/lib/errors'),
  Media         = require('../models/Media');


var MediaController = {

  getOne: function(req, res, next) {
    Media.findById(req.params.media_id, function(err, model) {

      /* istanbul ignore next */
      if (err) {
        return next( new errors.App(err) );
      }
      if (!model) {
        return next( new errors.NotFound() );
      }

      res.json( respFormatter(model) );
    });
  },


  getAll: function(req, res, next) {
    Media.find(function(err, models) {

      /* istanbul ignore next */
      if (err) {
        next( new errors.App(err) );
        return;
      }

      res.json( respFormatter(models) );
    });
  },


  create: function(req, res, next) {
    // create a new instance of the Media model
    var model = new Media();

    // set the media attributes
    model.name        = req.body.name;
    model.description = req.body.description;
    model.url         = req.body.url;
    model.active      = req.body.active;

    // save the media and check for errors
    model.save(function(err) {

      /* istanbul ignore next */
      if (err) {
        return next( new errors.App(err) );
      }

      res.json( respFormatter(model) );
    });
  },


  update: function(req, res, next) {
    Media.findById(req.params.media_id, function(err, model) {

      /* istanbul ignore next */
      if (err) {
        return next( new errors.App(err) );
      }
      if (!model) {
        return next( new errors.NotFound() );
      }

      // update the media info
      model.name        = req.body.name;
      model.description = req.body.description;
      model.url         = req.body.url;
      model.active      = req.body.active;

      // save the model
      model.save(function(err) {

        /* istanbul ignore next */
        if (err) {
          return next(err);
        }

        res.json( respFormatter(model) );
      });
    });
  },


  delete: function(req, res, next) {
    Media.findById(req.params.media_id, function(err, model) {

      /* istanbul ignore next */
      if (err) {
        return next( new errors.App(err) );
      }
      if (!model) {
        return next( new errors.NotFound() );
      }

      model.remove(function() {
        res.json( respFormatter(model) );
      });
    });
  }

};


module.exports = MediaController;
