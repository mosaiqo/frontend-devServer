'use strict';

var
  _          = require('underscore'),
  sortParser = require('./requestSortParser'),
  config     = require('../../../config');


/**
 * Parses the requested expands extracting the pagination options
 * @param  {Array} expands  The requested expands
 * @return {Object}         The parsed expands
 */
var parseExpands = function(expands) {
  return _.reduce(expands, _parseExpand, {});
};


/**
 * Expand parsing (parses the options for that expand, currently just the pagination opts)
 * @param  {Object} populationOpts  Already parsed expands object
 * @param  {String} expand          The new expand to parse
 * @return {Object}                 The original parsed expands object
 *                                  with the new parsed expand added
 */
var _parseExpand = function(populationOpts, expand) {
  var
    // default pagination opts
    defaults    = { page: 1, limit: config.pagination.defaultLimit, skip: 0 },

    expandParts = expand.split(':'),
    key         = expandParts.shift(),
    opts        = _.reduce(expandParts, _parseExpandOpt, defaults);


  if(opts.limit > config.pagination.maxLimit) {
    opts.limit = config.pagination.maxLimit;
  }

  if(opts.page) {
    opts.skip = opts.limit * (opts.page - 1);
  }

  populationOpts[key] = {
    options: _.omit(opts, ['page'])
  };

  return populationOpts;
};


/**
 * Expand option parsing
 * @param  {Object} opts    Already parsed expand options
 * @param  {String} rawOpt  The new option to parse
 * @return {Object}         The original options with the new parsed one added
 */
var _parseExpandOpt = function(opts, rawOpt) {
  var
    opt  = rawOpt.match(/^(\w+)\(/),
    args = rawOpt.match(/^\w+\((.*)\)/);

  if(opt && args) {
    opt  = opt[1];
    args = args[1];

    switch(opt) {
      case 'page':
        var page = parseInt(args, 10);
        if(!isNaN(page) && page > 0) {
          opts.page = page;
        }
        break;

      case 'per_page':
      case 'limit':
        var limit = parseInt(args, 10);
        if(!isNaN(limit)) {
          opts.limit = limit;
        }
        break;

      case 'sort':
      case 'order':
        opts.sort = _.extend(opts.sort || {}, sortParser.parse(args));
        break;
    }
  }
  return opts;
};


module.exports = {
  parse:           parseExpands,
  _parseExpand:    _parseExpand,
  _parseExpandOpt: _parseExpandOpt
};
