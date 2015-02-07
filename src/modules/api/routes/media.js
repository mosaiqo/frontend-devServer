/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

module.exports = function(router) {

  var
    Media   = require('../models/Media'),
    apiUtil = require('../../../lib/apiUtil');
console.log('-----------------router-media')

  router.route('/media')

    // get all the media (accessed at GET http://localhost:port/api/media)
    .get(function(req, res) {
      Media.find(function(err, models) {

        console.log('err', err)
        console.log('models', models)

        if (err) {
          res.status(500).json(apiUtil.getErrorResponse(500, null, err));
          return;
        }

        res.json(models);
      });
    })


    // create a media (accessed at POST http://localhost:port/api/media)
    .post(function(req, res) {

      // create a new instance of the Media model
      var model = new Media();

      // set the media attributes
      model.name        = req.body.name;
      model.description = req.body.description;
      model.url         = req.body.url;
      model.active      = req.body.active;

      // save the media and check for errors
      model.save(function(err) {
        if (err) {
          res.status(500).json(apiUtil.getErrorResponse(500, null, err));
          return;
        }

        res.json(model);
      });

    });


  router.route('/media/:media_id')

    // get the media with that id (accessed at GET http://localhost:port/api/media/:media_id)
    .get(function(req, res) {
      Media.findById(req.params.media_id, function(err, model) {

        if (err) {
          res.status(500).json(apiUtil.getErrorResponse(500, null, err));
          return;
        }

        if (!model) {
          res.status(404).json(apiUtil.getErrorResponse(404));
          return;
        }

        res.json(model);
      });
    })


    // update the media with this id (accessed at PUT http://localhost:port/api/media/:media_id)
    .put(function(req, res) {

      // use our media model to find the media we want
      Media.findById(req.params.media_id, function(err, model) {

        if (err) {
          res.status(500).json(apiUtil.getErrorResponse(500, null, err));
          return;
        }

        if (!model) {
          res.status(404).json(apiUtil.getErrorResponse(404));
          return;
        }

        // update the media info
        model.name        = req.body.name;
        model.description = req.body.description;
        model.url         = req.body.url;
        model.active      = req.body.active;

        // save the model
        model.save(function(err) {
          if (err) {
            res.send(err);
            return;
          }

          res.json(model);
        });
      });
    })


    // delete the media with this id (accessed at DELETE http://localhost:port/api/media/:media_id)
    .delete(function(req, res) {
      var model = Media.findOne({
        _id: req.params.media_id
      });

      Media.findById(req.params.media_id, function(err, model) {
        if (err) {
          res.status(500).json(apiUtil.getErrorResponse(500, null, err));
          return;
        }

        if (!model) {
          res.status(404).json(apiUtil.getErrorResponse(404));
          return;
        }

        model.remove(function() {
          res.json(model);
        });
      });
    });

};
