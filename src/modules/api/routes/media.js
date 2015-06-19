/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

module.exports = function(router) {

  var MediaController = require('../controllers/MediaController');


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
     *     {
     *       "meta" : {},
     *       "data": [
     *         {
     *           "id": "54f1a3dc2d4714c77f4d8bce",
     *           "name": "corporis incidunt est labore",
     *           "description": "necessitatibus enim cupiditate ex ullam autem hic natus nihil nostrum",
     *           "url": "http://lorempixel.com/640/480/cats",
     *           "active": true
     *         },
     *         {
     *           "id": "54f1a3dc2d4714c77f4d8bcf",
     *           "name": "ex nisi",
     *           "description": "tenetur at et hic alias id iusto et repudiandae soluta",
     *           "url": "http://lorempixel.com/640/480/cats",
     *           "active": true
     *         }
     *       ]
     *     }
     */
    .get(MediaController.getAll)


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
     *       "meta" : {},
     *       "data" : {
     *         "active": true,
     *         "url": "http://lorempixel.com/640/480/cats",
     *         "description": "ItemDescription",
     *         "name": "ItemName",
     *         "id": "551c31d0430d78991f5931e1"
     *       }
     *     }
     */
    .post(MediaController.create);


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
     *       "meta" : {},
     *       "data" : {
     *         "active": true,
     *         "url": "http://lorempixel.com/640/480/cats",
     *         "description": "ItemDescription",
     *         "name": "ItemName",
     *         "id": "551c31d0430d78991f5931e1"
     *       }
     *     }
     */
    .get(MediaController.getOne)


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
     *       "meta" : {},
     *       "data" : {
     *         "active": false,
     *         "url": "http://lorempixel.com/640/480/cats",
     *         "description": "ItemDescription2",
     *         "name": "ItemName2",
     *         "id": "551c31d0430d78991f5931e1"
     *       }
     *     }
     */
    .put(MediaController.update)


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
     *       "meta" : {},
     *       "data" : {
     *         "active": true,
     *         "url": "http://lorempixel.com/640/480/cats",
     *         "description": "ItemDescription",
     *         "name": "ItemName",
     *         "id": "551c31d0430d78991f5931e1"
     *       }
     *     }
     */
    .delete(MediaController.delete);

};
