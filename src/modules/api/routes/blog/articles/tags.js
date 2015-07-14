'use strict';

module.exports = function(router) {

  var
    BlogArticlesTagsController = require('../../../controllers/blog/ArticlesTagsController'),
    controller                 = new BlogArticlesTagsController(),
    tagArticlesMiddleware      = require('../../../middleware/tagArticles');


  router.route('/blog/articles/:articleId/tags')

    /**
     * @apiDefine BlogArticlesTags
     *
     * Blog/Articles/Tags
     *
     * Tags API endpoint for some article.
     *
     * This is exactly equal to [Blog/Tags](#api-BlogTags) except limiting the results to some article.
     */


    /**
     * @api {get} /blog/articles/:articleId/tags List the tags
     * @apiName List
     * @apiDescription List all the tags applied to some post
     * @apiGroup BlogArticlesTags
     */
    .get(controller.getAll.bind(controller))


    /**
     * @api {post} /blog/articles/:articleId/tags Create a new tag
     * @apiName Create
     * @apiDescription Create a new tag and assing it to the article
     * @apiGroup BlogArticlesTags
     */
    .post(tagArticlesMiddleware, controller.create.bind(controller));



  router.route('/blog/articles/:articleId/tags/:id')

    /**
     * @api {get} /blog/articles/:articleId/tags/:id Get a tag
     * @apiName Get
     * @apiDescription Get the tag with that id (for that article)
     * @apiGroup BlogArticlesTags
     */
    .get(controller.getOne.bind(controller))


    /**
     * @api {put} /blog/articles/:articleId/tags/:id Update a tag
     * @apiName Update
     * @apiDescription Update the tag with this id
     * @apiGroup BlogArticlesTags
     */
    .put(controller.updatePartial.bind(controller))


    /**
     * @api {patch} /blog/articles/:articleId/tags/:id Partial update a tag
     * @apiName Patch
     * @apiDescription Update the tag with this id. Only provided values will be applied
     * @apiGroup BlogArticlesTags
     */
    .patch(controller.update.bind(controller))


    /**
     * @api {delete} /blog/articles/:articleId/tags/:id Delete a tag
     * @apiName Delete
     * @apiDescription Delete the tag with this id
     * @apiGroup BlogArticlesTags
     */
    .delete(controller.delete.bind(controller));


};
