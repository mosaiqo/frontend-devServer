/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  _              = require('underscore'),
  async          = require('async'),
  respFormatter  = require('src/lib/responseFormatter'),
  RequestUtil    = require('src/lib/apiRequestUtil'),
  errors         = require('src/lib/errors'),
  slugger        = require('src/lib/slugger'),
  Article        = require('../../models/blog/Article'),
  TagsController = require('./TagsController'),
  BaseController = require('../BaseController');


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
 * Aux. method to mass assign the attributes to a model
 */
ArticlesController.prototype.fillModelAttributes = function(model, req) {
  model.title        = req.body.title;
  model.excerpt      = req.body.excerpt;
  model.body         = req.body.body;
  model.author       = req.body.author_id;
  model.owner        = req.user.userId;
  model.published    = req.body.published;
  model.published_at = req.body.publish_date;
  model.commentable  = req.body.commentable;

  return model;
};


/**
 * Create one new Article
 */
ArticlesController.prototype.create = function(req, res, next) {

  var slug, tags, model, r = new RequestUtil(req), that = this;

  async.series([

    // validate the attrs
    function(callback) {
      var doc = that.fillModelAttributes(new Article(), req);

      doc.validate(function (err) {
        /* istanbul ignore next */
        if (err) { return next(err); }
        callback();
      });
    },

    // get the slug (it's async because it ensures that the slug is not
    // already used and if so, it adds a numeric suffix)
    function(callback) {
      slugger(Article, req.body.title, null, function(err, articleSlug) {
        /* istanbul ignore next */
        if (err) { return next(err); }

        slug = articleSlug;
        callback();
      });
    },

    // get the tags IDs (and create the tags if they don't exist)
    function(callback) {
      var tc = new TagsController();

      tc.retrieveAndCreate(req, res, function(articleTags) {
        tags = articleTags;
        callback();
      });
    },

    // create the Article
    function(callback) {
      // set the article attributes
      model = that.fillModelAttributes(new Article(), req);
      model.slug = slug;
      model.tags = tags;

      model.save(callback);
    },

    // expand the relations
    function(callback) {
      model.populate(r.expands, callback);
    }

  ], function(err) {

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

  var slug, tags, model, r = new RequestUtil(req), that = this;

  async.series([

    // retrieve the model
    function(callback) {
      Article.findById(req.params.id, function(err, articleModel) {
        /* istanbul ignore next */
        if (err)           { return callback(err); }
        /* istanbul ignore next */
        if (!articleModel) { return callback(new errors.NotFound()); }

        model = articleModel;
        callback();
      });
    },

    // validate the attrs
    function(callback) {
      var doc = that.fillModelAttributes(new Article(), req);

      doc.validate(function (err) {
        /* istanbul ignore next */
        if (err) { return next(err); }
        callback();
      });
    },

    // get the slug (it's async because it ensures that the slug is not
    // already used and if so, it adds a numeric suffix)
    function(callback) {
      slugger(Article, req.body.title, req.body.slug, function(err, articleSlug) {
        /* istanbul ignore next */
        if (err) { return next(err); }

        slug = articleSlug;
        callback();
      });
    },

    // get the tags IDs (and create the tags if they don't exist)
    function(callback) {
      var tc = new TagsController();

      tc.retrieveAndCreate(req, res, function(articleTags) {
        tags = articleTags;
        callback();
      });
    },

    // update the Article
    function(callback) {

      // set the article attributes
      model = that.fillModelAttributes(model, req);
      model.slug         = slug;
      model.tags         = tags;
      model.updated_at   = Date.now()/1000;

      model.save(callback);
    },

    // expand the relations
    function(callback) {
      model.populate(r.expands, callback);
    }

  ], function(err) {

    /* istanbul ignore next */
    if (err) {
      return next(err);
    }

    var meta = r.getMeta();
    res.json(respFormatter(model, meta));

  });
};


module.exports = ArticlesController;
