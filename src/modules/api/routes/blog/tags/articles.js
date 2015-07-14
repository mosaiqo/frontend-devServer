'use strict';

module.exports = function(router) {

  var
    BlogTagsArticlesController = require('../../../controllers/blog/TagsArticlesController'),
    controller                 = new BlogTagsArticlesController(),
    articleTagsMiddleware      = require('../../../middleware/articleTags');


  router.route('/blog/tags/:tagId/articles')

    /**
     * @apiDefine BlogTagsArticles
     *
     * Blog/Tags/Articles
     *
     * Articles API endpoint for articles tagged with some tag.
     *
     * This is exactly equal to [Blog/Articles](#api-BlogArticles) except limiting the results to some tag.
     */


    /**
     * @api {get} /blog/tags/:tagId/articles List the articles
     * @apiName List
     * @apiDescription List all the articles tagged witth some tag
     * @apiGroup BlogArticlesTags
     */
    .get(controller.getAll.bind(controller))


    /**
     * @api {post} /blog/tags/:tagId/articles Create a new article
     * @apiName Create
     * @apiDescription Create a new article and assign it to the tag
     * @apiGroup BlogTagsArticles
     */
    .post(articleTagsMiddleware, controller.create.bind(controller));



  router.route('/blog/tags/:tagId/articles/:id')

    /**
     * @api {get} /blog/tags/:tagId/articles/:id Get an article
     * @apiName Get
     * @apiDescription Get the article with that id (and with that tag)
     * @apiGroup BlogTagsArticles
     */
    .get(controller.getOne.bind(controller))


    /**
     * @api {put} /blog/tags/:tagId/articles/:id Update an article
     * @apiName Update
     * @apiDescription Update the article with this id
     * @apiGroup BlogTagsArticles
     */
    .put(controller.update.bind(controller))


    /**
     * @api {patch} /blog/tags/:tagId/articles/:id Partial update an article
     * @apiName Patch
     * @apiDescription Update the article with this id. Only provided values will be applied
     * @apiGroup BlogTagsArticles
     */
    .patch(controller.updatePartial.bind(controller))


    /**
     * @api {delete} /blog/tags/:tagId/articles/:id Delete an article
     * @apiName Delete
     * @apiDescription Delete the article with this id
     * @apiGroup BlogTagsArticles
     */
    .delete(controller.delete.bind(controller));


};
