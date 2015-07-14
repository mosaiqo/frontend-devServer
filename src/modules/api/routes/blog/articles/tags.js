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
     * Tags API endpoint for some article
     * This is exactly equal to Blog/Tags except limiting the results to some article.
     */


    /**
     * @api {get} /blog/articles/:articleId/tags List all the tags applied to some post
     * @apiName List
     * @apiGroup BlogArticlesTags
     */
    .get(controller.getAll.bind(controller))


    /**
     * @api {post} /blog/articles/:articleId/tags Create a new tag and assing it to the article
     * @apiName Create
     * @apiGroup BlogArticlesTags
     */
    .post(tagArticlesMiddleware, controller.create.bind(controller));



  router.route('/blog/articles/:articleId/tags/:id')

    /**
     * @api {get} /blog/articles/:articleId/tags/:id Get the tag with that id (for that article)
     * @apiName Get
     * @apiGroup BlogArticlesTags
     */
    .get(controller.getOne.bind(controller))


    /**
     * @api {patch} /blog/articles/:articleId/tags/:id Update the tag with this id
     * @apiName Patch
     * @apiGroup BlogArticlesTags
     */
    .put(controller.updatePartial.bind(controller))


    /**
     * @api {put} /blog/articles/:articleId/tags/:id Update the tag with this id. Only provided values will be applied
     * @apiName Update
     * @apiGroup BlogArticlesTags
     */
    .patch(controller.update.bind(controller))


    /**
     * @api {delete} /blog/articles/:articleId/tags/:id Delete the tag with this id
     * @apiName Delete
     * @apiGroup BlogArticlesTags
     */
    .delete(controller.delete.bind(controller));


};
