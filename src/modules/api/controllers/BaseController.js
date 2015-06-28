/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  _              = require('underscore'),
  async          = require('async'),
  errors         = require('src/lib/errors'),
  respFormatter  = require('../util/responseFormatter'),
  RequestUtil    = require('../util/apiRequestUtil');


/**
 * BaseController contructor
 */
function BaseController() {}


/**
 * @type {Model}
 */
BaseController.prototype.Model = null;


/**
 * Retrieve one Model element
 */
BaseController.prototype.getOne = function(req, res, next) {

  var
    r        = new RequestUtil(req),
    criteria = _.extend({ '_id': req.params.id }, r.query);

  this.Model
    .findOne(criteria)
    .populate(r.expands)
    .exec(function(err, model) {
      /* istanbul ignore next */
      if (err)    { return next(err); }
      if (!model) { return next(new errors.NotFound()); }

      var meta = r.getMeta();
      res.json(respFormatter(model, meta));
    });
};


/**
 * Retrieve all the model instances, paginated
 */
BaseController.prototype.getAll = function(req, res, next) {

  var r = new RequestUtil(req);

  this.Model.paginate(r.query, r.page, r.limit, function(err, pageCount, paginatedResults, itemCount) {
    /* istanbul ignore next */
    if (err) { return next(err); }

    var meta = r.getMeta(null, { itemCount: itemCount, pageCount: pageCount });

    res.json(respFormatter(paginatedResults, meta));

  }, r.options);
};


/**
 * Create one Model instance and save it
 * @abstract
 */
/* istanbul ignore next */
BaseController.prototype.create = function(req, res, next) {};


/**
 * Edit one Model instance
 * @abstract
 */
/* istanbul ignore next */
BaseController.prototype.update = function(req, res, next) {};


/**
 * Delete one Model instance
 * @abstract
 */
BaseController.prototype.delete = function(req, res, next) {

  var
    r = new RequestUtil(req),
    criteria = _.extend({ 'id': req.params.id }, r.query);

  this.Model
    .findOne(criteria)
    .populate(r.expands)
    .exec(function(err, model) {

      /* istanbul ignore next */
      if (err)    { return next(err); }
      if (!model) { return next( new errors.NotFound() ); }

      model.remove(function() {
        res.json(respFormatter(model));
      });
  });
};


module.exports = BaseController;
