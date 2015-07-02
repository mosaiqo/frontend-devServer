'use strict';

var
  _        = require('underscore'),
  populate = require('mongoose-populator');


/**
 * Request utility
 *
 * Wraps the 'req' object returned by Express
 * and adds some useful methods.
 */
class Request {

  /**
   * @param {Object} the request object, returned by Express
   */
  constructor(request) {
    this.req = request;
  }


  /**
   * Getter for the data 'owner' (the client)
   *
   * All the documents have a 'owner' attribute to filter out the data
   * from other clients. Currently, this method just returns the user id
   * from the token.
   *
   * @todo  I think we should add another key to the user obj. (something like
   *        clientId) and use that so multiple different users con login for a
   *        given client.
   *
   * @return {ObjectId} the 'owner' id
   */
  getOwnerFromAuth() {
    return this.req.user.userId;
  }


  /**
   * @param {Number} maxDepth maximum nested expansion level (by default 1)
   * @return {Array}           the attributes to expand
   */
  getExpands(maxDepth) {
    var expands = this.req.query.expand;
    maxDepth = maxDepth || 1;

    if(expands) {
      return _.flatten([expands]).filter(function(expand) {
        return expand.split('.').length <= maxDepth;
      });
    } else {
      return [];
    }
  }


  /**
   * Mongoose queries options builder from the querystring params
   *
   * @return {Object} Options for the mongoose queries.
   *                  (currently this just returns the sort. opts,
   *                  because this is only used with the paginate model plugin,
   *                  where the limit is supplied as another arg.)
   */
  get options() {
    var opts = {}, sort = this._getSort();

    if(sort) {
      opts.sortBy = sort;
    }

    return opts;
  }


  /**
   * @return {Object} The pagination options,
   *                  that will be used on the response 'meta' node.
   */
  get pagination() {
    var pagination = {
      page:     parseInt(this.req.query.page || 1, 10),
      per_page: parseInt(this.req.query.per_page || this.req.query.limit, 10)
    };

    if(this.options.sortBy) {
      pagination.sortBy = this.options.sortBy;
    }

    return pagination;
  }


  /**
   * @return {String} The full request URL, without any querystring params
   */
  get requestURL() {
    return this.req.protocol + '://' + this.req.headers.host + this.req.baseUrl + this.req.path;
  }


  /**
   * @return {String} The base URL where the controller is mounted
   *                  (for example: http://localhost/api)
   */
  get requestBaseURL() {
    return this.req.protocol + '://' + this.req.headers.host + this.req.baseUrl;
  }


  /**
   * Results sorting direction getter
   *
   * Normalizes the supplied value or returns the default
   *
   * @return {String} Sort order
   */
  _getSortOrder() {
    var
      order       = 'asc', // default
      sortOptions = {
        'asc'  : 'asc',
        'desc' : 'desc',
        '1'    : 'asc',
        '-1'   : 'desc'
      };

    if(this.req.query.order) {
      this.req.query.order = this.req.query.order.toLowerCase();
      order = sortOptions[this.req.query.order] || order;
    }

    return order;
  }


  /**
   * Sort options builder
   * @return {Object} Sorting options for the mongoose queries
   */
  _getSort() {
    var
      sortOpts = null,
      order    = null;

    if(this.req.query.sort_by) {
      order    = this._getSortOrder(this.req);
      sortOpts = {};

      if(_.isArray(this.req.query.sort_by)) {
        this.req.query.sort_by.forEach(function(key) {
          sortOpts[key] = order;
        });
      } else {
        sortOpts[this.req.query.sort_by] = order;
      }
    }

    return sortOpts;
  }
}


module.exports = Request;
