/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  respFormatter = require('src/lib/responseFormatter'),
  errors        = require('src/lib/errors'),
  RequestUtil   = require('src/lib/apiRequestUtil'),
  slugger       = require('src/lib/slugger'),
  Article       = require('../../models/blog/Article');



var ArticlesController = {

  getOne: function(req, res, next) {

    var r = new RequestUtil(req);

    Article
      .findById(req.params.article_id)
      .populate(r.expands)
      .exec(function(err,model) {
        /* istanbul ignore next */
        if (err) {
          return next( new errors.App(err) );
        }
        if (!model) {
          return next( new errors.NotFound() );
        }

        var meta = r.getMeta();
        res.json(respFormatter(model, meta));
      });
  },


  getAll: function(req, res, next) {
    var r = new RequestUtil(req);

    Article.paginate(r.query, r.page, r.limit, function(err, pageCount, paginatedResults, itemCount) {
      /* istanbul ignore next */
      if (err) {
        next( new errors.App(err) );
        return;
      }

      var meta = r.getMeta(null, { itemCount: itemCount, pageCount: pageCount });

      res.json(respFormatter(paginatedResults, meta));

    }, r.options);

  },


  create: function(req, res, next) {

    slugger(Article, req.body.title, req.body.slug, function(articleSlug) {
      var r = new RequestUtil(req);

      // create a new instance of the Article model
      var model = new Article();

      // set the article attributes
      model.title        = req.body.title;
      model.slug         = articleSlug;
      model.excerpt      = req.body.excerpt;
      model.body         = req.body.body;
      model.author       = req.body.author_id;
      model.owner        = req.user.userId;
      model.published    = req.body.published;
      model.published_at = req.body.publish_date;
      model.commentable  = req.body.commentable;


      // save the article and check for errors
      model.save(function(err) {

        /* istanbul ignore next */
        if (err) {
          return next(err);
        }

        model.populate(r.expands, function(err, model) {
          /* istanbul ignore next */
          if (err) {
            return next( new errors.App(err) );
          }

          var meta = r.getMeta(model);
          res.json(respFormatter(model, meta));
        });

      });

    });

  },


  update: function(req, res, next) {

    var r = new RequestUtil(req);

    // use our article model to find the article we want
    Article.findById(req.params.article_id, function(err, model) {

      /* istanbul ignore next */
      if (err) {
        return next( new errors.App(err) );
      }
      if (!model) {
        return next( new errors.NotFound() );
      }

      slugger(Article, req.body.title, req.body.slug, function(articleSlug) {

        // update the article info
        model.title        = req.body.title;
        model.slug         = articleSlug;
        model.excerpt      = req.body.excerpt;
        model.body         = req.body.body;
        model.author       = req.body.author_id;
        model.owner        = req.user.userId;
        model.published    = req.body.published;
        model.published_at = req.body.publish_date;
        model.commentable  = req.body.commentable;
        model.updated_at   = Date.now();

        // save the model
        model.save(function(err) {

          /* istanbul ignore next */
          if (err) {
            return next(err);
          }

          model.populate(r.expands, function(err, model) {
            /* istanbul ignore next */
            if (err) {
              return next( new errors.App(err) );
            }

            var meta = r.getMeta();
            res.json(respFormatter(model, meta));
          });

        });

      });
    });

  },


  delete: function(req, res, next) {

    var r = new RequestUtil(req);

    Article
      .findById(req.params.article_id)
      .populate(r.expands)
      .exec(function(err,model) {

        /* istanbul ignore next */
        if (err) {
          return next( new errors.App(err) );
        }
        if (!model) {
          return next( new errors.NotFound() );
        }

        model.remove(function() {
          res.json(respFormatter(model));
        });
    });

  }

};


module.exports = ArticlesController;
