'use strict';

var
  _             = require('underscore'),
  expandsParser = require('./expandsParser'),
  sortParser    = require('./requestSortParser');


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
   * @return {Object}         the attributes to expand
   */
  getExpands(maxDepth) {
    maxDepth = maxDepth || 1;

    var
      expands       = _.compact(_.flatten([this.req.query.expand])),
      filteredSpans = {};

    if(expands) {
      // filter out the expands to a maximum depth
      filteredSpans = expands.filter(function(expand) {
        let expandPath = expand.split(':')[0];
        return expandPath.split('.').length <= maxDepth;
      });

      if(filteredSpans) {
        filteredSpans = expandsParser.parse(filteredSpans);
      }
    }

    return filteredSpans;
  }


  /**
   * Mongoose queries options builder from the querystring params
   *
   * @return {Object} Options for the mongoose queries.
   */
  get options() {
    var
      opts = {
        page:  parseInt(this.req.query.page || 1, 10),
        limit: parseInt(this.req.query.per_page || this.req.query.limit || 20, 10)
      },
      sort = this._getSort();

    if(sort) {
      opts.sortBy = sort;
    }

    return opts;
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
   * Sort options builder
   * @return {Object} Sorting options for the mongoose queries
   */
  _getSort() {
    var sortOpts = null;

    if(this.req.query.sort_by) {
      let sortParams = this.req.query.sort_by;

      if(_.isArray(sortParams)) {
        sortParams = sortParams.join(',');
      }

      sortOpts = sortParser.parse(sortParams);
    }

    return sortOpts;
  }

}


module.exports = Request;
