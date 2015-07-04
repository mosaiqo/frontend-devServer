'use strict';

var
  // generic stuff
  _               = require('underscore'),

  // API utilities
  ExpandsURLMap   = require('../../util/ExpandsURLMap'),

  // Base class
  TagsController  = require('./TagsController');


/**
 * ArticlesController
 */
class ArticlesTagsController extends TagsController
{
  constructor() {
    super();
  }


  // Aux. "private" methods
  // (actually they're not private so can be easily tested)
  // =============================================================================

  _buildCriteria(request) {
    var criteria = super._buildCriteria(request);

    if(request.req.params.articleId) {
      criteria.articles = request.req.params.articleId;
    }

    return criteria;
  }

  _getAssignableAttributes(request, customAttrs) {
    customAttrs = customAttrs || {};

    // When creating a new tag, link it.
    // Don't do it when updating to avoid overriding any other linked article.
    if(request.req.params.articleId && request.req.method === 'POST') {
      customAttrs.articles = request.req.params.articleId;
    }

    return super._getAssignableAttributes(request, customAttrs);
  }
}


module.exports = ArticlesTagsController;
