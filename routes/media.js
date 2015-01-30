module.exports = function(router) {
'use strict';

  var Media = require('../models/Media');

  router.route('/medias')

    // get all the medias (accessed at GET http://localhost:port/api/medias)
    .get(function(req, res) {
      Media.find(function(err, models) {
        if (err)
          res.send(err);
        res.json(models);
      });
    })


    // create a media (accessed at POST http://localhost:port/api/medias)
    .post(function(req, res) {

      // create a new instance of the Media model
      var model = new Media();

      // set the media attributes
      model.name        = req.body.name;
      model.description = req.body.description;
      model.active      = req.body.active;

      // save the media and check for errors
      model.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'Media created!' });
      });

    });


  router.route('/medias/:media_id')

    // get the media with that id (accessed at GET http://localhost:port/api/medias/:media_id)
    .get(function(req, res) {
      Media.findById(req.params.media_id, function(err, model) {
        if (err)
          res.send(err);
        res.json(model);
      });
    })


    // update the media with this id (accessed at PUT http://localhost:port/api/medias/:media_id)
    .put(function(req, res) {

      // use our media model to find the media we want
      Media.findById(req.params.media_id, function(err, model) {

        if (err)
          res.send(err);

        // update the media info
        model.name        = req.body.name;
        model.description = req.body.description;
        model.active      = req.body.active;

        // save the model
        model.save(function(err) {
          if (err)
            res.send(err);

          res.json({ message: 'Media updated!' });
        });
      });
    })


    // delete the media with this id (accessed at DELETE http://localhost:port/api/medias/:media_id)
    .delete(function(req, res) {
      Media.remove({
        _id: req.params.media_id
      }, function(err, model) {
        if (err)
          res.send(err);

        res.json({ message: 'Successfully deleted' });
      });
    });

};
