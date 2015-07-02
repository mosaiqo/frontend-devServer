'use strict';

var _ = require('underscore');

/**
 *
 */
class ResponseMeta {

  /**
   *
   */
  constructor(requestURL, paginationOpts) {
    this.requestURL = requestURL;
    this.paginationOpts = paginationOpts || {};
  }


  /**
   *
   */
  toJSON() {
    var meta = {
      url : this.requestURL
    };

    // add the paginator
    if(this.paginationOpts) {
      meta.paginator = this._getPaginator(this.paginationOpts);
    }

    return meta;
  }


  /**
   *
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
