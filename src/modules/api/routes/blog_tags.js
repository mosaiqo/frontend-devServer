/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

module.exports = function(router) {

  var
    BlogTagsController = require('../controllers/blog/TagsController'),
    controller         = new BlogTagsController();


  router.route('/blog/tags')

    /**
     * @apiDefine CommonApiParams
     *
     * @apiParam {String}  [expand]   Nested objects to expand. It can be an array.
     * @apiParam {Integer} [per_page] The methods that return multiple models are paginated by default. This determines
     *                                the number of elements returned (by default 20). There's a hard limit (200). Requests
     *                                with a greater value will return only the maximum allowed items.
     * @apiParam {Integer} [page]     The results page (for paginated results)
     * @apiParam {String}  [sort_by]  Sort criteria. Accepts multiple values (arrays)
     * @apiParam {String}  [order]    Sort direction. Accepted values: `1`, `-1`, `asc`, `desc`.
     *                                It's applied to all the sort_by (because the backbone.paginator does not support this,
     *                                anyway, this is really easy to change)
     *
     */


    /**
     * @apiDefine CommonApiResponseHeader
     *
     * @apiSuccess {Object} meta                 Response metadata
     * @apiSuccess {String} meta.url             Resource url
     * @apiSuccess {Object} [meta.paginator]     Pagination params
     *
     */


    /**
     * @apiDefine SingleEntityResponse
     *
     * @apiSuccess {Object} data                 The Tag data
     * @apiSuccess {String} data.id              Id
     * @apiSuccess {String} data.name            Tag name
     * @apiSuccess {String} data.slug            URL slug
     * @apiSuccess {String} [data.description]   Tag description
     * @apiSuccess {String} data.created_at      Creation date
     * @apiSuccess {String} data.updated_at      Last update date
     *
     */


    /**
     * @apiDefine MultipleEntityResponse
     *
     * @apiSuccess {Object[]} data               The Tags data
     * @apiSuccess {String} data.id              Id
     * @apiSuccess {String} data.name            Tag name
     * @apiSuccess {String} data.slug            URL slug
     * @apiSuccess {String} [data.description]   Tag description
     * @apiSuccess {String} data.created_at      Creation date
     * @apiSuccess {String} data.updated_at      Last update date
     *
     */


    /**
     * @api {get} /blog/tags List all the tags owned by the authenticated user
     * @apiName List
     * @apiGroup Blog/Tags
     *
     * @apiUse CommonApiParams
     *
     * @apiExample Example usage:
     * curl -4 -i curl -X GET -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTQzNDg0MTE5MywiZXhwIjoxNDM0ODQ0NzkzfQ.76hpdlVfAuBI59J1OTZ6y-nNGOkj7ZVOPgZagIJMxMQ" http://localhost:9000/api/blog/tags
     *
     * @apiUse CommonApiResponseHeader
     * @apiUse MultipleEntityResponse
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "meta" : {
     *         "url": "http://localhost:9001/blog/tags",
     *         "paginator": {
     *           "total_entries": 100,
     *           "total_pages": 5,
     *           "page": 1,
     *           "per_page": 20
     *         }
     *       },
     *       "data": [
     *         {
     *           "name": "nesciunt",
     *           "slug": "nesciunt",
     *           "updated_at": 1434807342,
     *           "created_at": 1434807342,
     *           "id": "5585eeb41b7b3b821cb5ba5e"
     *         },
     *         {
     *           "name": "nostrum",
     *           "slug": "nostrum",
     *           "updated_at": 1434836605,
     *           "created_at": 1434836605,
     *           "id": "5585eeb41b7b3b821cb5ba5f"
     *         }
     *       ]
     *     }
     *
     */
    .get(controller.getAll.bind(controller))


    /**
     * @api {post} /blog/tags Create a new tag
     * @apiName Create
     * @apiGroup Blog/Tags
     *
     * @apiParam {String} name           Tag name.
     * @apiParam {String} [description}  Tag description.
     * @apiUse CommonApiParams
     *
     * @apiExample Example usage:
     * curl -X POST -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTQzNDg0MTE5MywiZXhwIjoxNDM0ODQ0NzkzfQ.76hpdlVfAuBI59J1OTZ6y-nNGOkj7ZVOPgZagIJMxMQ" -H "Content-Type: application/x-www-form-urlencoded" -d 'name=foo&slug=foo&description=foo+description' http://localhost:9000/api/blog/tags
     *
     * @apiUse CommonApiResponseHeader
     * @apiUse SingleEntityResponse
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "meta": {
     *         "url": "http://localhost:9001/blog/tags/5585f14bb3c67d5022b4262a"
     *       },
     *       "data": {
     *         "slug": "foo-1",
     *         "description": "foo description",
     *         "name": "foo",
     *         "updated_at": 1434841419,
     *         "created_at": 1434841419,
     *         "id": "5585f14bb3c67d5022b4262a"
     *       }
     *     }
     *
     */
    .post(controller.create.bind(controller));



  router.route('/blog/tags/:id')

    /**
     * @api {get} /blog/tags Get the tag with that id
     * @apiName Get
     * @apiGroup Blog/Tags
     *
     * @apiUse CommonApiParams
     *
     * @apiExample Example usage:
     * curl -X GET -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTQzNDg0MTE5MywiZXhwIjoxNDM0ODQ0NzkzfQ.76hpdlVfAuBI59J1OTZ6y-nNGOkj7ZVOPgZagIJMxMQ" http://localhost:9000/api/blog/tags/5585eeb41b7b3b821cb5ba5e
     *
     * @apiUse CommonApiResponseHeader
     * @apiUse SingleEntityResponse
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "meta": {
     *         "url": "http://localhost:9001/blog/tags/5585eeb41b7b3b821cb5ba5e"
     *       },
     *       "data": {
     *         "name": "nesciunt",
     *         "slug": "nesciunt",
     *         "updated_at": 1434807342,
     *         "created_at": 1434807342,
     *         "id": "5585eeb41b7b3b821cb5ba5e"
     *       }
     *     }
     *
     */
    .get(controller.getOne.bind(controller))


    /**
     * @api {put} /blog/tags Update the tag with this id
     * @apiName Update
     * @apiGroup Blog/Tags
     *
     * @apiParam {String} name           Tag name.
     * @apiParam {String} [description]  Tag description.
     * @apiParam {String} [slug]         Slug. If not provided it will be autogenerated. If there's already some tag with the
     *                                   same slug, a numeric suffix will be added. For example, if the requested slug is *foo*
     *                                   and there's another tag with that slug, the slug for this tag will be *foo-1*
     * @apiUse CommonApiParams
     *
     * @apiExample Example usage:
     * curl -X PUT -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTQzNDg0MTE5MywiZXhwIjoxNDM0ODQ0NzkzfQ.76hpdlVfAuBI59J1OTZ6y-nNGOkj7ZVOPgZagIJMxMQ" -H "Content-Type: application/x-www-form-urlencoded" -d 'name=bar&slug=bar&description=bar+description' http://localhost:9000/api/blog/tags/5585eeb41b7b3b821cb5ba5e
     *
     * @apiUse CommonApiResponseHeader
     * @apiUse SingleEntityResponse
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "meta": {
     *         "url": "http://localhost:9001/blog/tags/5585eeb41b7b3b821cb5ba5e"
     *       },
     *       "data": {
     *         "description": "bar description",
     *         "name": "bar",
     *         "slug": "bar",
     *         "updated_at": 1434842,
     *         "created_at": 1434807342,
     *         "id": "5585eeb41b7b3b821cb5ba5e"
     *       }
     *     }
     *
     */
    .put(controller.update.bind(controller))


    /**
     * @api {delete} /blog/tags Delete the tag with this id
     * @apiName Delete
     * @apiGroup Blog/Tags
     *
     * @apiUse CommonApiParams
     *
     * @apiExample Example usage:
     * curl -X DELETE -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTQzNDg0MTE5MywiZXhwIjoxNDM0ODQ0NzkzfQ.76hpdlVfAuBI59J1OTZ6y-nNGOkj7ZVOPgZagIJMxMQ" http://localhost:9000/api/blog/tags/5585eeb41b7b3b821cb5ba5e
     *
     * @apiUse CommonApiResponseHeader
     * @apiUse SingleEntityResponse
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "meta": {},
     *       "data": {
     *         "name": "bar",
     *         "slug": "bar",
     *         "description": "bar description",
     *         "updated_at": 1434842,
     *         "created_at": 1434807342,
     *         "id": "5585eeb41b7b3b821cb5ba5e"
     *       }
     *     }
     *
     */
    .delete(controller.delete.bind(controller));


};
