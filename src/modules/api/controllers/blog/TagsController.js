/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  // generic stuff
  _               = require('underscore'),
  async           = require('async'),
  errors          = require('src/lib/errors'),

  // API utilities
  respFormatter   = require('../../util/responseFormatter'),
  RequestUtil     = require('../../util/apiRequestUtil'),
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
 * Create a new Tag
 */
TagsController.prototype.create = function(req, res, next) {

  var r = new RequestUtil(req), that = this;

  async.waterfall([
    function setup(callback) {
      var
        attrs = _.extend({ owner: req.user.userId }, _.pick(req.body, Tag.safeAttrs)),
        model = new Tag(attrs),
        options = {
          expands: r.expands,
          slug:    null
        };

      callback(null, model, options);
    },
    that._validate,
    that._setSlug,
    that._save,
    that._applyExpands

  ], function asyncComplete(err, model) {

    /* istanbul ignore next */
    if (err) { return next(err); }

    var meta = r.getMeta(model);
    res.json(respFormatter(model, meta));
  });
};


/**
 * Update a Tag
 */
TagsController.prototype.update = function(req, res, next) {

  var r = new RequestUtil(req), that = this;

  async.waterfall([
    function setup(callback) {
      var criteria = _.extend({ '_id': req.params.id }, r.query);

      Tag.findOne(criteria).exec(function(err, tagModel) {
        /* istanbul ignore next */
        if (err)           { return callback(err); }
        /* istanbul ignore next */
        if (!tagModel) { return callback(new errors.NotFound()); }

        var
          options = {
            expands: r.expands,
            slug:    req.body.slug
          };

        // assign the new attributes
        tagModel.set(_.pick(req.body, Tag.safeAttrs));

        callback(null, tagModel, options);
      });
    },
    that._validate,
    that._setSlug,
    that._save,
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


TagsController.prototype._applyExpands = function(model, options, callback) {
  model.populate(options.expands, function() {
    callback(null, model);
  });
};


module.exports = TagsController;
