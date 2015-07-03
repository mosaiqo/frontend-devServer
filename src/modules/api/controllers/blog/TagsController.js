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
  slugger         = require('../../util/slugger'),

  // Base class
  BaseController  = require('../BaseController'),

  // Model managed by this controller
  Tag             = require('../../models/blog/Tag');


/**
 * TagsController contructor
 */
function TagsController() {
  BaseController.call(this);
}
// make it extend the parent class
TagsController.prototype = Object.create(BaseController.prototype);


/**
 * @type {Model}
 */
TagsController.prototype.Model = Tag;


/**
 * Nested references output config
 *
 * @type {ExpandsURLMap}
 */
TagsController.prototype.expandsURLMap = new ExpandsURLMap({
  "articles": {
    "route": "/blog/tags/:parentId/articles",
    "expands": {
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


/**
 * Create a new Tag
 */
TagsController.prototype.create = function(req, res, next) {
  var
    request  = new Request(req),
    response = new Response(request, this.expandsURLMap);

  async.waterfall([
    function setup(callback) {
      var
        attrs = _.extend({ owner: req.user.userId }, _.pick(req.body, Tag.safeAttrs)),
        model = new Tag(attrs);

      callback(null, model, { slug: null });
    },
    this._validate,
    this._setSlug,
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
};


/**
 * Update a Tag
 */
TagsController.prototype.update = function(req, res, next) {
  var
    request  = new Request(req),
    response = new Response(request, this.expandsURLMap);

  async.waterfall([
    function setup(callback) {
      var criteria = {
        _id:   req.params.id,
        owner: request.getOwnerFromAuth()
      };

      Tag.findOne(criteria).exec(function(err, tagModel) {
        /* istanbul ignore next */
        if (err)           { return callback(err); }
        /* istanbul ignore next */
        if (!tagModel) { return callback(new errors.NotFound()); }

        // assign the new attributes
        tagModel.set(_.pick(req.body, Tag.safeAttrs));

        callback(null, tagModel, { slug: req.body.slug });
      });
    },
    this._validate,
    this._setSlug,
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
};



// Aux. "private" methods
// (actually they're not private so can be easily tested)
// =============================================================================

TagsController.prototype._validate = function(model, options, callback) {
  model.validate(function (err) {
    /* istanbul ignore next */
    if (err) { return callback(err); }
    callback(null, model, options);
  });
};


TagsController.prototype._setSlug = function(model, options, callback) {
  slugger(Tag, model.name, options.slug, function(err, tagSlug) {
    /* istanbul ignore next */
    if (err) { return callback(err); }

    model.slug = tagSlug;
    callback(null, model, options);
  });
};


TagsController.prototype._save = function(model, options, callback) {
  model.save(function(err) {
    /* istanbul ignore next */
    if (err) { return callback(err); }
    callback(null, model, options);
  });
};


module.exports = TagsController;
