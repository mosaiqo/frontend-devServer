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
     * Articles API endpoint for articles tagged with some tag
     * This is exactly equal to Blog/Articles except limiting the results to some tag.
     */


    /**
     * @api {get} /blog/tags/:tagId/articles List all the articles tagged witth some tag
     * @apiName List
     * @apiGroup BlogArticlesTags
     */
    .get(controller.getAll.bind(controller))


    /**
     * @api {post} /blog/tags/:tagId/articles Create a new article and assign it to the tag
     * @apiName Create
     * @apiGroup BlogTagsArticles
     */
    .post(articleTagsMiddleware, controller.create.bind(controller));



  router.route('/blog/tags/:tagId/articles/:id')

    /**
     * @api {get} /blog/tags/:tagId/articles/:id Get the article with that id (and with that tag)
     * @apiName Get
     * @apiGroup BlogTagsArticles
     */
    .get(controller.getOne.bind(controller))


    /**
     * @api {put} /blog/tags/:tagId/articles/:id Update the article with this id
     * @apiName Update
     * @apiGroup BlogTagsArticles
     */
    .put(controller.update.bind(controller))


    /**
     * @api {patch} /blog/tags/:tagId/articles/:id Update the article with this id. Only provided values will be applied
     * @apiName Patch
     * @apiGroup BlogTagsArticles
     */
    .patch(controller.updatePartial.bind(controller))


    /**
     * @api {delete} /blog/tags/:tagId/articles/:id Delete the article with this id
     * @apiName Delete
     * @apiGroup BlogTagsArticles
     */
    .delete(controller.delete.bind(controller));


};
