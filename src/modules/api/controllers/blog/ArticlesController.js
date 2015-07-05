'use strict';

var
  // generic stuff
  _               = require('underscore'),
  async           = require('async'),
  errors          = require('src/lib/errors'),

  // API utilities
  Request         = require('../../util/Request'),
  Response        = require('../../util/Response'),
  ArticleTagsUtil = require('../../util/ArticleTagsUtil'),
  ExpandsURLMap   = require('../../util/ExpandsURLMap'),
  slugger         = require('../../util/slugger'),

  // Base class
  BaseController  = require('../BaseController'),

  // Model managed by this controller
  Article = require('../../models/blog/Article');


/**
 * ArticlesController
 */
class ArticlesController extends BaseController
{
  constructor() {
    super();
    /**
     * @type {Model}
     */
    this.Model = Article;

    /**
     * Nested references output config
     *
     * @type {ExpandsURLMap}
     */
    this.expandsURLMap = new ExpandsURLMap({
      "author": {
        "route": "/authors/:itemId"
      },
      "tags": {
        "route": "/blog/articles/:parentId/tags",
        "expands": {
          "articles": {
            "route": "/blog/tags/:parentId/articles",
            "expands": {
              "tags": {
                "route": "/blog/articles/:parentId/tags"
              },
              "author": {
                "route": "/authors/:itemId"
              }
            }
          }
        }
      }
    });
  }


  /**
   * Create a new Article
   */
  create(req, res, next) {
    var
      that     = this,
      request  = new Request(this._preprocessRequest(req)),
      response = new Response(request, this.expandsURLMap),

      // mass assignable attrs.
      newAttrs = this._getAssignableAttributes(request);


    async.waterfall([
      function setup(callback) {
        var
          model = new Article(newAttrs),
          options = { slug: null };

        if(!_.isUndefined(req.body.tags)) { options.tags = req.body.tags; }

        /* istanbul ignore next */
        if(req.body.author_id) { model.author = req.body.author_id; }

        callback(null, model, options);
      },
      this._validate,
      this._setSlug,
      this._setTags,
      this._save

    ], function asyncComplete(err, model) {

      /* istanbul ignore next */
      if (err) { return next(err); }

      response.formatOutput(model, function(err, output) {
        /* istanbul ignore next */
        if (err) { return next(err); }

        res.json(output);
      });
    });
  }


  /**
   * Update an Article
   */
  update(req, res, next) {
    var
      request  = new Request(this._preprocessRequest(req)),
      response = new Response(request, this.expandsURLMap),

      // query used to find the doc
      criteria = this._buildCriteria(request),

      // mass assignable attrs.
      newAttrs = this._getAssignableAttributes(request);


    async.waterfall([
      function setup(callback) {
        Article.findOne(criteria).exec(function(err, articleModel) {
          /* istanbul ignore next */
          if (err)           { return callback(err); }
          /* istanbul ignore next */
          if (!articleModel) { return callback(new errors.NotFound()); }

          var options = {};
          if(!_.isUndefined(req.body.tags)) { options.tags = req.body.tags; }
          if(!_.isUndefined(req.body.slug)) { options.slug = req.body.slug; }

          // assign the new attributes
          articleModel.set(newAttrs);

          /* istanbul ignore next */
          if(req.body.author_id) { articleModel.author = req.body.author_id; }

          callback(null, articleModel, options);
        });
      },
      this._validate,
      this._setSlug,
      this._setTags,
      this._save

    ], function asyncComplete(err, model) {

      /* istanbul ignore next */
      if (err) { return next(err); }

      response.formatOutput(model, function(err, output) {
        /* istanbul ignore next */
        if (err) { return next(err); }

        res.json(output);
      });
    });
  }


  // Aux. "private" methods
  // (actually they're not private so can be easily tested)
  // =============================================================================

  _setSlug(model, options, callback) {
    if(_.isUndefined(options.slug)) {
      callback(null, model, options);
    } else {
      slugger(Article, model.title, options.slug, function(err, articleSlug) {
        /* istanbul ignore next */
        if (err) { return callback(err); }

        model.slug = articleSlug;
        callback(null, model, options);
      });
    }
  }


  _setTags(model, options, callback) {
    if(_.isUndefined(options.tags)) {
      callback(null, model, options);
    } else {

      let tags = options.tags || [];

      if(!_.isObject(tags) || !_.isArray(tags)) {
        try {
          tags = JSON.parse(tags);
        } catch(e) {
          return callback( errors.Validation(model, 'tags', 'Tags must be a valid JSON') );
        }
      }

      ArticleTagsUtil.setArticleTags(model, tags, function(err) {
        /* istanbul ignore next */
        if (err) {
          if(err.code === 11000) {
            var repeatedTag = /:\ "(.+)" \}$/.exec(err.message)[1];
            err = errors.Validation(model, 'tags', "Can't create tag '" + repeatedTag + "', already exists");
          }

          return callback(err);
        }
        callback(null, model, options);
      });
    }
  }

}


module.exports = ArticlesController;
