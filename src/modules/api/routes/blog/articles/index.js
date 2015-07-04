'use strict';

module.exports = function(router) {

  var
    BlogArticlesController = require('../../../controllers/blog/ArticlesController'),
    controller             = new BlogArticlesController();


  router.route('/blog/articles')

  /**
   * @apiDefine BlogArticles
   *
   * Blog/Articles
   * Articles API endpoint
   */


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
     * @apiSuccess {Object} data                 The Article data
     * @apiSuccess {String} data.id              Id
     * @apiSuccess {String} data.title           Title
     * @apiSuccess {String} data.body            Article body
     * @apiSuccess {String} data.slug            URL slug
     * @apiSuccess {String} [data.excerpt]       Excerpt
     * @apiSuccess {String} data.published       Publish status
     * @apiSuccess {String} [data.publish_date]  Publish date
     * @apiSuccess {String} data.created_at      Creation date
     * @apiSuccess {String} data.updated_at      Last update date
     * @apiSuccess {String} data.author          Author id.
     *                                           Can be expanded to the full author object (see the `expand` parameter)
     * @apiSuccess {String} data.commentable     Commenting enabled
     * @apiSuccess {String} data.tags            Post tags (array of the tags IDs).
     *                                           Can be expanded to the full author object (see the `expand` parameter)
     *
     */


    /**
     * @apiDefine MultipleEntityResponse
     *
     * @apiSuccess {Object[]} data The Articles data
     * @apiSuccess {String} data.id              Id
     * @apiSuccess {String} data.title           Title
     * @apiSuccess {String} data.body            Article body
     * @apiSuccess {String} data.slug            URL slug
     * @apiSuccess {String} [data.excerpt]       Excerpt
     * @apiSuccess {String} data.published       Publish status
     * @apiSuccess {String} [data.publish_date]  Publish date
     * @apiSuccess {String} data.created_at      Creation date
     * @apiSuccess {String} data.updated_at      Last update date
     * @apiSuccess {String} data.author          Author id.
     *                                           Can be expanded to the full author object (see the `expand` parameter)
     * @apiSuccess {String} data.commentable     Commenting enabled
     * @apiSuccess {String} data.tags            Post tags (array of the tags IDs).
     *                                           Can be expanded to the full author object (see the `expand` parameter)
     *
     */


    /**
     * @api {get} /blog/articles List all the articles owned by the authenticated user
     * @apiName List
     * @apiGroup BlogArticles
     *
     * @apiUse CommonApiParams
     *
     * @apiExample Example usage:
     * curl -4 -i http://localhost:9000/api/blog/articles --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
     *
     * @apiUse CommonApiResponseHeader
     * @apiUse MultipleEntityResponse
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
     */
    .get(controller.getAll.bind(controller))


    /**
     * @api {post} /blog/articles Create a new article
     * @apiName Create
     * @apiGroup BlogArticles
     *
     * @apiParam {String} title          Post title.
     * @apiParam {String} body           Post content.
     * @apiParam {String} [excerpt]      Excerpt.
     * @apiParam {String} author_id      The author id.
     * @apiParam {Boolean} published     Publish status.
     * @apiParam {Number} [publish_date] Publish date, as a timestamp. If `published` is true and the `publish_date` is
     *                                   provided, the post will not be published until that date.
     * @apiParam {String} commentable    Enable user comments.
     * @apiParam {mixed}  tags           Post tags, as objects (an array of this objects is accepted)
     *                                   The objects must have an id attribute for existing tags. If the tag does not have
     *                                   an ID it is assumed to be a new one and the creation of the tag will be attempted.
     * @apiUse CommonApiParams
     *
     * @apiExample Example usage:
     * curl -X POST -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTQzNDYzMzgwNCwiZXhwIjoxNDM0NjM3NDA0fQ.IwPItcFLIDzA1MvwDXNYjVF0PxVcQ_Mft5wAU-2D8bY" -H "Content-Type: application/x-www-form-urlencoded" -d 'title=Article+title&slug=article-slug&excerpt=Article+excerpt&body=Article+body&commentable=1&author_id=000000000000000000000001&published=1&publish_date=1434540172' http://localhost:9000/api/blog/articles
     *
     * @apiUse CommonApiResponseHeader
     * @apiUse SingleEntityResponse
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
     */
    .post(controller.create.bind(controller));



  router.route('/blog/articles/:id')

    /**
     * @api {get} /blog/articles/:id Get the article with that id
     * @apiName Get
     * @apiGroup BlogArticles
     *
     * @apiUse CommonApiParams
     *
     * @apiExample Example usage:
     * curl -4 -i http://localhost:9000/api/blog/articles/551c31d0430d78991f5931e1 --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
     *
     * @apiUse CommonApiResponseHeader
     * @apiUse SingleEntityResponse
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
     */
    .get(controller.getOne.bind(controller))


    /**
     * @api {put} /blog/articles/:id Update the article with this id
     * @apiName Update
     * @apiGroup BlogArticles
     *
     * @apiParam {String} title          Post title.
     * @apiParam {String} body           Post content.
     * @apiParam {String} [slug]         Slug. If not provided it will be autogenerated. If there's already some post with the
     *                                   same slug, a numeric suffix will be added. For example, if the requested slug is *foo*
     *                                   and there's another post with that slug, the slug for this post will be *foo-1*
     * @apiParam {String} [excerpt]      Excerpt.
     * @apiParam {String} author_id      The author id.
     * @apiParam {Boolean} published     Publish status.
     * @apiParam {Number} [publish_date] Publish date, as a timestamp. If `published` is true and the `publish_date` is
     *                                   provided, the post will not be published until that date.
     * @apiParam {String} commentable    Enable user comments.
     * @apiParam {mixed}  tags           Post tags, as objects (an array of this objects is accepted)
     *                                   The objects must have an id attribute for existing tags. If the tag does not have
     *                                   an ID it is assumed to be a new one and the creation of the tag will be attempted.
     * @apiUse CommonApiParams
     *
     * @apiExample Example usage:
     * curl -X PUT -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTQzNDYzMzgwNCwiZXhwIjoxNDM0NjM3NDA0fQ.IwPItcFLIDzA1MvwDXNYjVF0PxVcQ_Mft5wAU-2D8bY" -H "Content-Type: application/x-www-form-urlencoded" -d 'title=Test&slug=this-is-a-test&excerpt=Holaquetal&body=HOCTL%C2%B7LA&commentable=1&author_id=000000000000000000000001&published=1&publish_date=1434540172' http://localhost:9000/api/blog/articles/5581f70e4901e5baa84a9652
     *
     * @apiUse CommonApiResponseHeader
     * @apiUse SingleEntityResponse
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
     */
    .put(controller.update.bind(controller))


    /**
     * @api {delete} /blog/articles/:id Delete the article with this id
     * @apiName Delete
     * @apiGroup BlogArticles
     *
     * @apiUse CommonApiParams
     *
     * @apiExample Example usage:
     * curl -4 -i -X DELETE http://localhost:9000/api/blog/articles/551c31d0430d78991f5931e1 --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGVlNjE3NTQ2NWVhZWUzNWNkMjM3ZWQiLCJpYXQiOjE0Mjc4MTczNTksImV4cCI6MTQyNzgyMDk1OX0.M3BboY6U9RJlX1ulVG7e9xRVrVdY3qVhvp3jmZaOCJ8"
     *
     * @apiUse CommonApiResponseHeader
     * @apiUse SingleEntityResponse
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
     */
    .delete(controller.delete.bind(controller));


};
