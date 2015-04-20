/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

module.exports = function(router) {

  var
    Media   = require('../models/Media'),
    errors  = require('../../../lib/errors');


  router.route('/media')

    /**
     * @api {get} /media List all media objects
     * @apiName List
     * @apiGroup Media
     *
     * @apiExample Example usage:
     * curl -4 -i http://localhost:9000/api/media --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       {
     *         "id": "54f1a3dc2d4714c77f4d8bce",
     *         "name": "corporis incidunt est labore",
     *         "description": "necessitatibus enim cupiditate ex ullam autem hic natus nihil nostrum",
     *         "url": "http://lorempixel.com/640/480/cats",
     *         "active": true
     *       },
     *       {
     *         "id": "54f1a3dc2d4714c77f4d8bcf",
     *         "name": "ex nisi",
     *         "description": "tenetur at et hic alias id iusto et repudiandae soluta",
     *         "url": "http://lorempixel.com/640/480/cats",
     *         "active": true
     *       }
     *     ]
     */
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


    /**
     * @api {post} /media Create a media object
     * @apiName Create
     * @apiGroup Media
     *
     * @apiExample Example usage:
     * curl -4 -i -X POST http://localhost:9000/api/media --data "name=ItemName&description=ItemDescription&url=http%3A%2F%2Florempixel.com%2F640%2F480%2Fcats&active=true" --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "active": true,
     *       "url": "http://lorempixel.com/640/480/cats",
     *       "description": "ItemDescription",
     *       "name": "ItemName",
     *       "id": "551c31d0430d78991f5931e1"
     *     }
     */
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
        if (err) {
          return next( new errors.App(err) );
        }

        res.json(model);
      });

    });


  router.route('/media/:media_id')

    /**
     * @api {get} /media Get the media with that id
     * @apiName Get
     * @apiGroup Media
     *
     * @apiExample Example usage:
     * curl -4 -i http://localhost:9000/api/media/551c31d0430d78991f5931e1 --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "active": true,
     *       "url": "http://lorempixel.com/640/480/cats",
     *       "description": "ItemDescription",
     *       "name": "ItemName",
     *       "id": "551c31d0430d78991f5931e1"
     *     }
     */
    .get(function(req, res, next) {
      Media.findById(req.params.media_id, function(err, model) {

        /* istanbul ignore next */
        if (err) {
          return next( new errors.App(err) );
        }
        if (!model) {
          return next( new errors.NotFound() );
        }

        res.json(model);
      });
    })


    /**
     * @api {put} /media Update the media with this id
     * @apiName Update
     * @apiGroup Media
     *
     * @apiExample Example usage:
     * curl -4 -i -X PUT http://localhost:9000/api/media/551c31d0430d78991f5931e1 --data "name=ItemName&description=ItemDescription&active=false" --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "active": false,
     *       "url": "http://lorempixel.com/640/480/cats",
     *       "description": "ItemDescription2",
     *       "name": "ItemName2",
     *       "id": "551c31d0430d78991f5931e1"
     *     }
     */
    .put(function(req, res, next) {

      // use our media model to find the media we want
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

          res.json(model);
        });
      });
    })


    /**
     * @api {delete} /media Delete the media with this id
     * @apiName Delete
     * @apiGroup Media
     *
     * @apiExample Example usage:
     * curl -4 -i -X DELETE http://localhost:9000/api/media/551c31d0430d78991f5931e1 --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "active": true,
     *       "url": "http://lorempixel.com/640/480/cats",
     *       "description": "ItemDescription",
     *       "name": "ItemName",
     *       "id": "551c31d0430d78991f5931e1"
     *     }
     */
    .delete(function(req, res, next) {
      var model = Media.findOne({
        _id: req.params.media_id
      });

      Media.findById(req.params.media_id, function(err, model) {

        /* istanbul ignore next */
        if (err) {
          return next( new errors.App(err) );
        }
        if (!model) {
          return next( new errors.NotFound() );
        }

        model.remove(function() {
          res.json(model);
        });
      });
    });

};
