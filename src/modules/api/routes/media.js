/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

module.exports = function(router) {

  var
    Media   = require('../models/Media'),
    errors  = require('../../../lib/errors');


  router.route('/media')

    // get all the media (accessed at GET http://localhost:port/api/media)
    .get(function(req, res, next) {
      Media.find(function(err, models) {

        /* istanbul ignore next */
        if (err) {
          next( new errors.App(err) );
          return;
        }

        res.json(models);
      });
    })


    // create a media (accessed at POST http://localhost:port/api/media)
    .post(function(req, res, next) {

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
        if (err) return next( new errors.App(err) );

        res.json(model);
      });

    });


  router.route('/media/:media_id')

    // get the media with that id (accessed at GET http://localhost:port/api/media/:media_id)
    .get(function(req, res, next) {
      Media.findById(req.params.media_id, function(err, model) {

        /* istanbul ignore next */
        if (err) return next( new errors.App(err) );
        if (!model) return next( new errors.NotFound() );

        res.json(model);
      });
    })


    // update the media with this id (accessed at PUT http://localhost:port/api/media/:media_id)
    .put(function(req, res, next) {

      // use our media model to find the media we want
      Media.findById(req.params.media_id, function(err, model) {

        /* istanbul ignore next */
        if (err) return next( new errors.App(err) );
        if (!model) return next( new errors.NotFound() );

        // update the media info
        model.name        = req.body.name;
        model.description = req.body.description;
        model.url         = req.body.url;
        model.active      = req.body.active;

        // save the model
        model.save(function(err) {

          /* istanbul ignore next */
          if (err) return next(err);

          res.json(model);
        });
      });
    })


    // delete the media with this id (accessed at DELETE http://localhost:port/api/media/:media_id)
    .delete(function(req, res, next) {
      var model = Media.findOne({
        _id: req.params.media_id
      });

      Media.findById(req.params.media_id, function(err, model) {

        /* istanbul ignore next */
        if (err) return next( new errors.App(err) );
        if (!model) return next( new errors.NotFound() );

        model.remove(function() {
          res.json(model);
        });
      });
    });

};
