/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

module.exports = function(router) {

  var BlogArticlesController = require('../controllers/blog/ArticlesController');


  router.route('/blog/articles')

    /**
     * @apiDefine CommonApiParams
     *
     * @apiParam {String} [expand] Nested objects to expand. It can be an array.
     * @apiParam {Integer} [per_page] The methods that return multiple models are paginated by default. This determines
     *                                the number of elements returned (by default 20). There's a hard limit (200). Requests
     *                                with a greater value will return only the maximum allowed items.
     * @apiParam {Integer} [page]     The results page (for paginated results)
     * @apiParam {String}  [sort_by]  Sort criteria. Accepts multiple values (arrays)
     * @apiParam {String}  [order]    Sort direction. Accepted values: `1`, `-1`, `asc`, `desc`.
     *                                It's applied to all the sort_by (because the backbone.paginator does not support this,
     *                                anyway, this is really easy to change)
     *
     *
     */


    /**
     * @api {get} /blog/articles List all the articles owned by the authenticated user
     * @apiName List
     * @apiGroup Blog/Articles
     *
     * @apiExample Example usage:
     * curl -4 -i http://localhost:9000/api/blog/articles --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "meta" : {
     *         "url": "http://localhost:9001/blog/articles",
     *         "paginator": {
     *           "total_entries": 100,
     *           "total_pages": 5,
     *           "page": 1,
     *           "per_page": 20
     *         }
     *       },
     *       "data": [
     *         {
     *           "author": "000000000000000000000001",
     *           "body": "Article body",
     *           "excerpt": "Article excerpt",
     *           "slug": "article-slug-1",
     *           "title": "Article title",
     *           "updated_at": 1434627873,
     *           "created_at": 1434627873,
     *           "commentable": true,
     *           "publish_date": 1434540,
     *           "published": true,
     *           "id": "5582af212207075ddbc42210"
     *         },
     *         {
     *           "author": "000000000000000000000001",
     *           "body": "Article body",
     *           "excerpt": "Article excerpt",
     *           "slug": "article-slug-2",
     *           "title": "Article title",
     *           "updated_at": 1434628060,
     *           "created_at": 1434628060,
     *           "commentable": true,
     *           "publish_date": 1434540,
     *           "published": true,
     *           "id": "5582afdc2cf7b648dcf84aba"
     *         }
     *       ]
     *     }
     *
     * @apiUse CommonApiParams
     *
     */
    .get(BlogArticlesController.getAll)


    /**
     * @api {post} /blog/articles Create a new article
     * @apiName Create
     * @apiGroup Blog/Articles
     *
     * @apiExample Example usage:
     * curl -X POST -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTQzNDYzMzgwNCwiZXhwIjoxNDM0NjM3NDA0fQ.IwPItcFLIDzA1MvwDXNYjVF0PxVcQ_Mft5wAU-2D8bY" -H "Content-Type: application/x-www-form-urlencoded" -d 'title=Article+title&slug=article-slug&excerpt=Article+excerpt&body=Article+body&commentable=1&author_id=000000000000000000000001&published=1&publish_date=1434540172' http://localhost:9000/api/blog/articles
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "meta": {
     *         "url": "http://localhost:9001/blog/articles/5582cedfbc15803005798b8f"
     *       },
     *       "data": {
     *         "author": "000000000000000000000001",
     *         "body": "Article body",
     *         "excerpt": "Article excerpt",
     *         "slug": "article-slug-16",
     *         "title": "Article title",
     *         "updated_at": 1434636000,
     *         "created_at": 1434636000,
     *         "commentable": true,
     *         "publish_date": 1434540,
     *         "published": true,
     *         "id": "5582cedfbc15803005798b8f"
     *       }
     *     }
     *
     * @apiUse CommonApiParams
     *
     */
    .post(BlogArticlesController.create);



  router.route('/blog/articles/:article_id')

    /**
     * @api {get} /blog/articles Get the article with that id
     * @apiName Get
     * @apiGroup Blog/Articles
     *
     * @apiExample Example usage:
     * curl -4 -i http://localhost:9000/api/blog/articles/551c31d0430d78991f5931e1 --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "meta": {
     *         "url": "http://localhost:9001/blog/articles/5581f70e4901e5baa84a9652"
     *       },
     *       "data": {
     *         "title": "Test",
     *         "slug": "this-is-a-test",
     *         "excerpt": "Holaquetal",
     *         "body": "HOLAQUETAL",
     *         "author": "000000000000000000000001",
     *         "updated_at": 1434622332,
     *         "created_at": 1434518089,
     *         "commentable": true,
     *         "publish_date": 1434540,
     *         "published": true,
     *         "id": "5581f70e4901e5baa84a9652"
     *       }
     *     }
     *
     * @apiUse CommonApiParams
     *
     */
    .get(BlogArticlesController.getOne)


    /**
     * @api {put} /blog/articles Update the article with this id
     * @apiName Update
     * @apiGroup Blog/Articles
     *
     * @apiExample Example usage:
     * curl -X PUT -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTQzNDYzMzgwNCwiZXhwIjoxNDM0NjM3NDA0fQ.IwPItcFLIDzA1MvwDXNYjVF0PxVcQ_Mft5wAU-2D8bY" -H "Content-Type: application/x-www-form-urlencoded" -d 'title=Test&slug=this-is-a-test&excerpt=Holaquetal&body=HOCTL%C2%B7LA&commentable=1&author_id=000000000000000000000001&published=1&publish_date=1434540172' http://localhost:9000/api/blog/articles/5581f70e4901e5baa84a9652
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "meta": {
     *         "url": "http://localhost:9001/blog/articles/5581f70e4901e5baa84a9652"
     *       },
     *       "data": {
     *         "title": "Test",
     *         "slug": "this-is-a-test",
     *         "excerpt": "Holaquetal",
     *         "body": "HOLAQUETAL",
     *         "author": "000000000000000000000001",
     *         "updated_at": 1434636343,
     *         "created_at": 1434518089,
     *         "commentable": true,
     *         "publish_date": 1434540,
     *         "published": true,
     *         "id": "5581f70e4901e5baa84a9652"
     *       }
     *     }
     *
     * @apiUse CommonApiParams
     *
     */
    .put(BlogArticlesController.update)


    /**
     * @api {delete} /blog/articles Delete the article with this id
     * @apiName Delete
     * @apiGroup Blog/Articles
     *
     * @apiExample Example usage:
     * curl -4 -i -X DELETE http://localhost:9000/api/blog/articles/551c31d0430d78991f5931e1 --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "meta": {},
     *       "data": {
     *         "title": "Test",
     *         "slug": "this-is-a-test",
     *         "excerpt": "Holaquetal",
     *         "body": "HOLAQUETAL",
     *         "author": "000000000000000000000001",
     *         "updated_at": 1434636343,
     *         "created_at": 1434518089,
     *         "commentable": true,
     *         "publish_date": 1434540,
     *         "published": true,
     *         "id": "5581f70e4901e5baa84a9652"
     *       }
     *     }
     *
     * @apiUse CommonApiParams
     *
     */
    .delete(BlogArticlesController.delete);


};
