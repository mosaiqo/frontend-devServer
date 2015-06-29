
/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  // generic stuff
  _       = require('underscore'),
  async   = require('async'),

  // API utilities
  slugger = require('./slugger'),

  // Models
  Tag     = require('../models/blog/Tag');


/**
 * Sets the tags for an article
 *
 * Sets the article tags, linking them (bidirectionally),
 * and creating the tags if don't exist.
 *
 * @param {Article}  article The article model
 * @param {mixed}    tags    A tag object or an array of tags
 * @param {Function} next    Callback
 */
var setArticleTags = function(article, tags, next) {
  async.waterfall([

    function setup(callback) {
      // make sure it's an array
      if(!_.isArray(tags)) {
        tags = [tags];
      }

      // remove dupplicates
      tags = _.uniq(tags, function(tag) {
        return tag.id || tag.name;
      });

      callback(null, article, tags);
    },

    createUnexistingTags,
    updateTagsArticles,
    updateArticleTags,

  ], function asyncComplete(err, model) {

    /* istanbul ignore next */
    if (err) { return next(err); }
    next(null, article);
  });
};


/**
 * Creates the unexistant tags for an article
 *
 * @param {Article}  article        The article model
 * @param {Array}    requestedTags  All the tags to assign.
 *                                  Only the unexistant ones will be created.
 * @param {Function} next           Callback
 */
var createUnexistingTags = function(article, requestedTags, callback) {

  var
    newArticleTags = requestedTags.filter(function(tag) {
      return !!tag.id;
    }),
    tagsToCreate  = requestedTags.filter(function(tag) {
      return !tag.id && tag.name;
    }).map(function(tag) {
      return tag.name;
    });

  async.forEach(tagsToCreate, function(tagName, cb) {
    slugger(Tag, tagName, null, function(err, tagSlug) {
      var model = new Tag({
        name:     tagName,
        slug:     tagSlug,
        owner:    article.owner,
        articles: article.id
      });

      model.save(function(err) {
        /* istanbul ignore next */
        if(err) { return callback(err); }
        newArticleTags.push(model);
        cb();
      });
    });
  }, function(err) {
    /* istanbul ignore next */
    if(err) { return callback(err); }
    callback(null, article, newArticleTags);
  });
};


/**
 * Links the tags to a given Article updating the tags 'articles' tag attributes
 *
 * @param {Article}  article        The article model
 * @param {Array}    newArticleTags The tags to assign.
 * @param {Function} next           Callback
 */
var updateTagsArticles = function(article, newArticleTags, callback) {

  var
    currentTags    = article.tags || [],
    tagsIdToLink   = newArticleTags.map(_getObjId),
    currentTagIds  = currentTags.map(_getObjId),
    tagIdsToUnlink = _.difference(currentTagIds, tagsIdToLink),
    actions        = [];

  if(tagIdsToUnlink.length) {
    actions.push({
      criteria: { _id: {$in: tagIdsToUnlink}, owner: article.owner },
      update:   { $pull: { 'articles': article.id } }
    });
  }

  if(tagsIdToLink.length) {
    actions.push({
      criteria: { _id: {$in: tagsIdToLink}, owner: article.owner },
      update:   { $addToSet: { 'articles': article.id } }
    });
  }

  if(!actions.length) {
    callback(null, article, newArticleTags);
  } else {
    async.each(actions, function(action, cb) {

      Tag.update(action.criteria, action.update, {multi: true}, function(err, numAffected) {
        /* istanbul ignore next */
        if(err) { return cb(err); }
        cb(null);
      });

    }, function(err) {
      /* istanbul ignore next */
      if(err) { return callback(err); }
      callback(null, article, newArticleTags);
    });
  }
};


/**
 * Links the tags to a given Article updating the article 'tags' attribute
 *
 * @param {Article}  article        The article model
 * @param {Array}    newArticleTags The tags to assign.
 * @param {Function} next           Callback
 */
var updateArticleTags = function(article, newArticleTags, callback) {

  article.tags = newArticleTags.map(_getObjId);
  article.save(function(err) {
    callback(null, article);
  });
};


/**
 * Aux. funct. When dealing with object nested relations,
 * the nexted objects can be expanded or they can be just Node ObjectIds
 *
 * @param {mixed} tag The tag model or just its id
 * @return {String} the tag id
 */
var _getObjId = function(tag) {
  return tag.toHexString ? tag.toHexString() : tag.id;
};


module.exports = {
  setArticleTags: setArticleTags,
  createUnexistingTags: createUnexistingTags,
  updateTagsArticles: updateTagsArticles,
  updateArticleTags: updateArticleTags,
  _getObjId: _getObjId
};
