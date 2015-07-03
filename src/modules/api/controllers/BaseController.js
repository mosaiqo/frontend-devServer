'use strict';

var
  _             = require('underscore'),
  async         = require('async'),
  errors        = require('src/lib/errors'),
  Request       = require('../util/Request'),
  Response      = require('../util/Response'),
  ExpandsURLMap = require('../util/ExpandsURLMap');


/**
 * BaseController contructor
 */
function BaseController() {}


/**
 * @type {Model}
 */
BaseController.prototype.Model = null;


/**
 * Nested references output config
 *
 * @type {ExpandsURLMap}
 */
BaseController.prototype.expandsURLMap = new ExpandsURLMap();


/**
 * Retrieve one Model element
 */
BaseController.prototype.getOne = function(req, res, next) {

  var
    request  = new Request(req),
    response = new Response(request, this.expandsURLMap),

    criteria = {
      owner: request.getOwnerFromAuth(),
      _id:   req.params.id
    };

  this.Model
    .findOne(criteria)
    .exec(function(err, model) {
      /* istanbul ignore next */
      if (err)    { return next(err); }
      if (!model) { return next(new errors.NotFound()); }

      response.formatOutput(model, function(err, output) {
        /* istanbul ignore next */
        if (err) { return next(err); }

        res.json(output);
      });
    });
};


/**
 * Retrieve all the model instances, paginated
 */
BaseController.prototype.getAll = function(req, res, next) {

  var
    request    = new Request(req),
    response   = new Response(request, this.expandsURLMap),
    pagination = request.pagination,

    criteria   = { owner: request.getOwnerFromAuth() },
    opts       = { page: pagination.page, limit: pagination.limit };


  this.Model.paginate(criteria, opts, function(err, paginatedResults, pageCount, itemCount) {
    /* istanbul ignore next */
    if (err) { return next(err); }

    response
      .setPaginationParams(pageCount, itemCount)
      .formatOutput(paginatedResults, function(err, output) {
        /* istanbul ignore next */
        if (err) { return next(err); }

        res.json(output);
      });

  }, request.options);
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
 */
BaseController.prototype.delete = function(req, res, next) {

  var
    request  = new Request(req),
    response = new Response(request, this.expandsURLMap),
    criteria = {
      owner: request.getOwnerFromAuth(),
      _id:   req.params.id
    };

  this.Model
    .findOne(criteria)
    .exec(function(err, model) {
      /* istanbul ignore next */
      if (err)    { return next(err); }
      if (!model) { return next( new errors.NotFound() ); }

      model.remove(function() {
        response.formatOutput(model, function(err, output) {
          /* istanbul ignore next */
          if (err) { return next(err); }
          
          res.json(output);
        });
      });
  });
};


module.exports = BaseController;
