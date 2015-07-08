'use strict';

var _ = require('underscore');

/**
 * Response 'meta' node formatter
 *
 * Adds the meta node with the document URL, pagination params and other metadata
 */
class ResponseMeta {

  /**
   * @param {String} requestURL     Full request url, without the querystring params
   * @param {Object} paginationOpts Pagination options
   * @param {Object} otherAttrs     Other attributes to add to the meta node
   */
  constructor(requestURL, paginationOpts, otherAttrs) {
    this.requestURL     = requestURL;
    this.paginationOpts = paginationOpts;
    this.otherAttrs     = otherAttrs;
  }


  /**
   * @return {Object} the formatted 'meta' node
   */
  toJSON() {
    var meta = {
      url : this.requestURL
    };

    // add the paginator
    if(this.paginationOpts) {
      meta.paginator = this._getPaginator(this.paginationOpts);
    }

    if(this.otherAttrs) {
      meta = _.extend(meta, this.otherAttrs);
    }

    return meta;
  }


  /**
   * Builds the 'paginator' node
   * @param  {Object} pagination  Pagination options
   * @return {Object}             The formatted 'paginator' object
   */
  _getPaginator(pagination) {
    var paginator = {
      total_entries: pagination.itemCount,
      total_pages:   pagination.pageCount,
      page:          pagination.page,
      per_page:      pagination.limit
    };

    if(pagination.sortBy) {
      let
        k = _.keys(pagination.sortBy),
        v = _.values(pagination.sortBy);

      paginator.sort_by = k.length > 1 ? k : k[0];
      paginator.order   = v[0];
    }

    return paginator;
  }
}


module.exports = ResponseMeta;
