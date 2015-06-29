'use strict';

var _ = require('underscore');

/**
 * API request utilities
 *
 * Generic request parameters parsing
 *
 * @param {Object} req
 */
var ApiRequestUtil = function(req) {

  /**
   * Request URL getter
   * @return {String} The entity base URL
   */
  var getRequestURL = function() {
    return req.protocol + '://' + req.get('host') + req.path;
  };


  /**
   * @return {String} the attributes to expand
   */
  var getExpands = function() {
    if(req.query.expand) {
      return _.flatten([req.query.expand]).join(' ');
    } else {
      return '';
    }
  };


  /**
   * Results sorting direction getter
   *
   * Normalizes the supplied value or returns the default
   *
   * @return {String} Sort order
   */
  var getSortOrder = function() {
    var
      order       = 'asc', // default
      sortOptions = {
        'asc'  : 'asc',
        'desc' : 'desc',
        '1'    : 'asc',
        '-1'   : 'desc'
      };

    if(req.query.order) {
      req.query.order = req.query.order.toLowerCase();
      order = sortOptions[req.query.order] || order;
    }

    return order;
  };


  /**
   * Sort options builder
   * @return {Object} Sorting options for the mongoose queries
   */
  var getSort = function() {
    var
      sortOpts = null,
      order    = null;

    if(req.query.sort_by) {
      order    = getSortOrder(req);
      sortOpts = {};

      if(_.isArray(req.query.sort_by)) {
        req.query.sort_by.forEach(function(key) {
          sortOpts[key] = order;
        });
      } else {
        sortOpts[req.query.sort_by] = order;
      }
    }

    return sortOpts;
  };


  /**
   * Mongoose options builder
   * @return {Object}
   */
  var getOptions = function() {
    var
        opts    = {},
        expands = getExpands(),
        sort    = getSort();

      if(expands) {
        opts.populate = expands;
      }

      if(sort) {
        opts.sortBy = sort;
      }

      return opts;
  };



  return {
    /**
     * @type {Integer}
     */
    page    : parseInt(req.query.page || 1, 10),

    /**
     * @type {Integer}
     */
    limit   : parseInt(req.query.per_page || req.query.limit, 10),

    /**
     * @type {Object}
     */
    options : getOptions(),

    /**
     * Query builder for the mongoose calls (for now, it just restricts the results to the owned resources)
     * @return {String}
     */
    get query () {
      // i think we should add another key to the user obj.
      // (something like clientId) and use that
      return { owner: req.user.userId };
    },


    /**
     * @return {Array}
     */
    get expands () {
      return getExpands();
    },


    /**
     * Response meta builder
     * @param  {Model}  model
     * @param  {Object} pagination
     * @return {Object}
     */
    getMeta : function(model, pagination) {

      var ret = {};

      // add the entity url
      ret.url = getRequestURL();

      if(model) {
        ret.url += '/' + model.id;
      }


      // add the pagionator
      if(pagination) {
        var paginator = {
          total_entries: pagination.itemCount,
          total_pages:   pagination.pageCount
        };

        paginator.page     = this.page;
        paginator.per_page = this.limit;

        if(this.options.sortBy) {
          var
            k = _.keys(this.options.sortBy),
            v = _.values(this.options.sortBy);

          paginator.sort_by = k.length > 1 ? k : k[0];
          paginator.order   = v[0];
        }

        ret.paginator = paginator;
      }

      return ret;
    }
  };

};


module.exports = ApiRequestUtil;
