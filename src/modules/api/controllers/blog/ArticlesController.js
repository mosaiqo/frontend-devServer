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
  TagsController = require('./TagsController');



var ArticlesController = {

  getOne: function(req, res, next) {

    var
      r        = new RequestUtil(req),
      criteria = _.extend({ '_id': req.params.article_id }, r.query);

    Article
      .findOne(criteria)
      .populate(r.expands)
      .exec(function(err, model) {
        /* istanbul ignore next */
        if (err)    { return next(err); }
        if (!model) { return next(new errors.NotFound()); }

        var meta = r.getMeta();
        res.json(respFormatter(model, meta));
      });
  },


  getAll: function(req, res, next) {
    var r = new RequestUtil(req);

    Article.paginate(r.query, r.page, r.limit, function(err, pageCount, paginatedResults, itemCount) {
      /* istanbul ignore next */
      if (err) { return next(err); }

      var meta = r.getMeta(null, { itemCount: itemCount, pageCount: pageCount });

      res.json(respFormatter(paginatedResults, meta));

    }, r.options);

  },


  create: function(req, res, next) {

    var slug, tags, model, r = new RequestUtil(req);

    async.series([

      // get the slug (it's async because it ensures that the slug is not
      // already used and if so, it adds a numeric suffix)
      function(callback) {
        slugger(Article, req.body.title, null, function(articleSlug) {
          slug = articleSlug;
          callback();
        });
      },

      // get the tags IDs (and create the tags if they don't exist)
      function(callback) {
        TagsController.retrieveAndCreate(req, function(articleTags) {
          tags = articleTags;
          callback();
        });
      },

      // create the Article
      function(callback) {
        model = new Article(); // create a new instance of the Article model

        // set the article attributes
        model.title        = req.body.title;
        model.slug         = slug;
        model.excerpt      = req.body.excerpt;
        model.body         = req.body.body;
        model.author       = req.body.author_id;
        model.owner        = req.user.userId;
        model.published    = req.body.published;
        model.published_at = req.body.publish_date;
        model.commentable  = req.body.commentable;
        model.tags         = tags;

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

  },


  update: function(req, res, next) {

    var slug, tags, model, r = new RequestUtil(req);

    async.series([

      // retrieve the model
      function(callback) {
        Article.findById(req.params.article_id, function(err, articleModel) {
          /* istanbul ignore next */
          if (err)           { return callback(err); }
          /* istanbul ignore next */
          if (!articleModel) { return callback(new errors.NotFound()); }

          model = articleModel;
          callback();
        });
      },

      // get the slug (it's async because it ensures that the slug is not
      // already used and if so, it adds a numeric suffix)
      function(callback) {
        slugger(Article, req.body.title, req.body.slug, function(articleSlug) {
          slug = articleSlug;
          callback();
        });
      },

      // get the tags IDs (and create the tags if they don't exist)
      function(callback) {
        TagsController.retrieveAndCreate(req, function(articleTags) {
          tags = articleTags;
          callback();
        });
      },

      // update the Article
      function(callback) {

        // set the article attributes
        model.title        = req.body.title;
        model.slug         = slug;
        model.excerpt      = req.body.excerpt;
        model.body         = req.body.body;
        model.author       = req.body.author_id;
        model.owner        = req.user.userId;
        model.published    = req.body.published;
        model.published_at = req.body.publish_date;
        model.commentable  = req.body.commentable;
        model.tags         = tags;

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
  },


  delete: function(req, res, next) {

    var r = new RequestUtil(req);

    Article
      .findById(req.params.article_id)
      .populate(r.expands)
      .exec(function(err, model) {

        /* istanbul ignore next */
        if (err)    { return next(err); }
        if (!model) { return next( new errors.NotFound() ); }

        model.remove(function() {
          res.json(respFormatter(model));
        });
    });
  }

};


module.exports = ArticlesController;
