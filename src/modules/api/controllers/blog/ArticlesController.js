'use strict';

var
  // generic stuff
  _               = require('underscore'),
  async           = require('async'),
  errors          = require('src/lib/errors'),

  // API utilities
  respFormatter   = require('../../util/responseFormatter'),
  RequestUtil     = require('../../util/apiRequestUtil'),
  ArticleTagsUtil = require('../../util/ArticleTagsUtil'),
  slugger         = require('../../util/slugger'),

  // Base class
  BaseController  = require('../BaseController'),

  // Model managed by this controller
  Article         = require('../../models/blog/Article');


/**
 * ArticlesController contructor
 */
function ArticlesController() {
  BaseController.call(this);
}
// make it extend the parent class
ArticlesController.prototype = Object.create(BaseController.prototype);


/**
 * @type {Model}
 */
ArticlesController.prototype.Model = Article;


/**
 * Create a new Article
 */
ArticlesController.prototype.create = function(req, res, next) {

  var r = new RequestUtil(req), that = this;

  async.waterfall([
    function setup(callback) {
      var
        attrs = _.extend({ owner: req.user.userId }, _.pick(req.body, Article.safeAttrs)),
        model = new Article(attrs),
        options = {
          tags:    req.body.tags,
          expands: r.expands,
          slug:    null
        };

      /* istanbul ignore next */
      if(req.body.author_id) { model.author = req.body.author_id; }

      callback(null, model, options);
    },
    that._validate,
    that._setSlug,
    that._setTags,
    that._applyExpands

  ], function asyncComplete(err, model) {

    /* istanbul ignore next */
    if (err) { return next(err); }

    var meta = r.getMeta(model);
    res.json(respFormatter(model, meta));
  });
};


/**
 * Update an Article
 */
ArticlesController.prototype.update = function(req, res, next) {

  var r = new RequestUtil(req), that = this;

  async.waterfall([
    function setup(callback) {
      var criteria = _.extend({ '_id': req.params.id }, r.query);

      Article.findOne(criteria).exec(function(err, articleModel) {
        /* istanbul ignore next */
        if (err)           { return callback(err); }
        /* istanbul ignore next */
        if (!articleModel) { return callback(new errors.NotFound()); }

        var options = {
          tags:    req.body.tags,
          expands: r.expands,
          slug:    req.body.slug
        };

        // assign the new attributes
        articleModel.set(_.pick(req.body, Article.safeAttrs));

        /* istanbul ignore next */
        if(req.body.author_id) { articleModel.author = req.body.author_id; }

        callback(null, articleModel, options);
      });
    },
    that._validate,
    that._setSlug,
    that._setTags,
    that._applyExpands

  ], function asyncComplete(err, model) {

    /* istanbul ignore next */
    if (err) { return next(err); }

    var meta = r.getMeta();
    res.json(respFormatter(model, meta));
  });
};


// Aux. "private" methods
// (actually they're not private so can be easily tested)
// =============================================================================


ArticlesController.prototype._validate = function(model, options, callback) {
  model.validate(function (err) {
    /* istanbul ignore next */
    if (err) { return callback(err); }
    callback(null, model, options);
  });
};


ArticlesController.prototype._setSlug = function(model, options, callback) {
  slugger(Article, model.title, options.slug, function(err, articleSlug) {
    /* istanbul ignore next */
    if (err) { return callback(err); }

    model.slug = articleSlug;
    callback(null, model, options);
  });
};


ArticlesController.prototype._setTags = function(model, options, callback) {
  var tags = options.tags || [];

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
};


ArticlesController.prototype._applyExpands = function(model, options, callback) {
  model.populate(options.expands, function() {
    callback(null, model);
  });
};


module.exports = ArticlesController;
