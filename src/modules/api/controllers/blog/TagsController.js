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
 * Aux. method to mass assign the attributes to a model
 */
TagsController.prototype.fillModelAttributes = function(model, req) {
  model.name         = req.body.name;
  model.description  = req.body.description;
  model.owner        = req.user.userId;

  return model;
};


/**
 * @param  {Array} models
 * @return {Array}        The models id attributes
 */
TagsController.prototype.getTagsIds = function(models) {
  return models.map(function(tag) {
    return tag.id;
  });
};


/**
 * Returns the Tag models id form its names.
 * If some tag does not exist, it will be created
 */
TagsController.prototype.retrieveAndCreate = function(req, res, next) {

  var
    that     = this,
    r        = new RequestUtil(req),

    // retrieve the data from the request
    owner    = req.user.userId,
    tagNames = req.body.tags_names;

  // if no tags, just exit
  if(!tagNames) {
    return next([]);
  }

  // convert to an array if necessary so all the tag documents
  // can be retrieved in one call using $in
  if(!_.isArray(tagNames)) {
    tagNames = [tagNames];
  }

  // retrieve the tags that already exist
  var criteria = _.extend({ 'name': {$in: tagNames}}, r.query);

  Tag.find(criteria, function(err, tags) {

    // check if there's any tag to create
    var notFound = tagNames.filter(function(tagName) {
      return _.findIndex(tags, { name: tagName }) === -1;
    });

    if(!notFound.length) {
      // no new tags to create, just return the found tags ids
      next(that.getTagsIds(tags));
    } else {
      // create the new tags
      async.forEach(notFound, function(tagName, callback) {
        slugger(Tag, tagName, null, function(err, tagSlug) {
          var model = new Tag({
            name:  tagName,
            slug:  tagSlug,
            owner: owner
          });

          model.save(function(err) {
            tags.push(model);
            callback();
          });
        });

      }, function(err) {
        /* istanbul ignore next */
        if(err) { return next(err); }

        // return the ids for the new tags and the preexisting ones
        next(that.getTagsIds(tags));
      });
    }
  });

};


/**
 * Create one new Tag
 */
TagsController.prototype.create = function(req, res, next) {

  var slug, tags, model, r = new RequestUtil(req), that = this;

  async.series([

    // validate the attrs
    function(callback) {
      var doc = that.fillModelAttributes(new Tag(), req);

      doc.validate(function (err) {
        /* istanbul ignore next */
        if (err) { return next(err); }
        callback();
      });
    },

    // get the slug (it's async because it ensures that the slug is not
    // already used and if so, it adds a numeric suffix)
    function(callback) {
      slugger(Tag, req.body.name, null, function(err, tagSlug) {
        /* istanbul ignore next */
        if (err) { return next(err); }

        slug = tagSlug;
        callback();
      });
    },

    // create the Tag
    function(callback) {
      // set the article attributes
      model = that.fillModelAttributes(new Tag(), req);
      model.slug = slug;

      model.save(callback);
    }

  ], function(err) {

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

  var slug, tags, model, r = new RequestUtil(req), that = this;

  async.series([

    // retrieve the model
    function(callback) {
      Tag.findById(req.params.id, function(err, tagModel) {
        /* istanbul ignore next */
        if (err)       { return callback(err); }
        /* istanbul ignore next */
        if (!tagModel) { return callback(new errors.NotFound()); }

        model = tagModel;
        callback();
      });
    },


    // validate the attrs
    function(callback) {
      var doc = that.fillModelAttributes(new Tag(), req);

      doc.validate(function (err) {
        /* istanbul ignore next */
        if (err) { return next(err); }
        callback();
      });
    },

    // get the slug (it's async because it ensures that the slug is not
    // already used and if so, it adds a numeric suffix)
    function(callback) {
      slugger(Tag, req.body.name, req.body.slug, function(err, tagSlug) {
        slug = tagSlug;
        callback();
      });
    },

    // update the Tag
    function(callback) {
      // set the article attributes
      model = that.fillModelAttributes(model, req);
      model.slug       = slug;
      model.updated_at = Date.now()/1000;

      model.save(callback);
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


module.exports = TagsController;
