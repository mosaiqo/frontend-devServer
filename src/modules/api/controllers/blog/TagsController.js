'use strict';

var
  // generic stuff
  _               = require('underscore'),
  async           = require('async'),
  errors          = require('src/lib/errors'),

  // API utilities
  Request         = require('../../util/Request'),
  Response        = require('../../util/Response'),
  ExpandsURLMap   = require('../../util/ExpandsURLMap'),
  ArticleTagsUtil = require('../../util/ArticleTagsUtil'),
  slugger         = require('../../util/slugger'),

  // Base class
  BaseController  = require('../BaseController'),

  // Model managed by this controller
  Tag             = require('../../models/blog/Tag');


/**
 * TagsController
 */
class TagsController extends BaseController
{
  constructor() {
    super();
    /**
     * @type {Model}
     */
    this.Model = Tag;

    /**
     * Nested references output config
     *
     * @type {ExpandsURLMap}
     */
    this.expandsURLMap = new ExpandsURLMap({
      "articles": {
        "route": "/blog/tags/:parentId/articles",
        "expands": {
          "author": {
            "route": "/authors/:itemId"
          },
          "tags": {
            "route": "/blog/articles/:parentId/tags",
            "expands": {
              "articles": {
                "route": "/blog/tags/:parentId/articles"
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
   * Create a new Tag
   */
  create(req, res, next) {
    var
      request  = new Request(req),
      response = new Response(request, this.expandsURLMap),

      // mass assignable attrs.
      newAttrs = this._getAssignableAttributes(request);


    async.waterfall([
      function setup(callback) {
        var model = new Tag(newAttrs);

        var options = { slug: null };
        if(!_.isUndefined(req.body.articles)) { options.articles = req.body.articles; }

        console.log('req.body:', req.body);

        callback(null, model, options);
      },
      this._validate,
      this._setSlug,
      this._setArticles,
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
   * Update a Tag
   */
  update(req, res, next) {
    var
      request  = new Request(req),
      response = new Response(request, this.expandsURLMap),

      // query used to find the doc
      criteria = this._buildCriteria(request),

      // mass assignable attrs.
      newAttrs = this._getAssignableAttributes(request);

    async.waterfall([
      function setup(callback) {
        Tag.findOne(criteria).exec(function(err, tagModel) {
          /* istanbul ignore next */
          if (err)           { return callback(err); }
          /* istanbul ignore next */
          if (!tagModel) { return callback(new errors.NotFound()); }

          // assign the new attributes
          tagModel.set(newAttrs);

          var options = {};
          if(!_.isUndefined(req.body.slug))     { options.slug = req.body.slug; }
          if(!_.isUndefined(req.body.articles)) { options.tags = req.body.articles; }

          callback(null, tagModel, options);
        });
      },
      this._validate,
      this._setSlug,
      this._setArticles,
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
      slugger(Tag, model.name, options.slug, function(err, tagSlug) {
        /* istanbul ignore next */
        if (err) { return callback(err); }

        model.slug = tagSlug;
        callback(null, model, options);
      });
    }
  }


  _setArticles(model, options, callback) {
    if(_.isUndefined(options.articles)) {
      callback(null, model, options);
    } else {
      let articles = options.articles || [];

      if(!_.isObject(articles) || !_.isArray(articles)) {
        try {
          articles = JSON.parse(articles);
        } catch(e) {
          return callback( errors.Validation(model, 'articles', 'Articles must be a valid JSON') );
        }
      }

      ArticleTagsUtil.setTagArticles(model, articles, function(err, model) {
        /* istanbul ignore next */
        if(err) { return callback(err); }
        callback(null, model, options);
      });
    }
  }

}


module.exports = TagsController;
