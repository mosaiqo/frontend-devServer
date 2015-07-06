'use strict';

var _ = require('underscore');

/**
 * Response 'data' node formatter
 *
 * It basically transforms the models nested relations into objects
 * with 'meta' and 'data' attributes, where the 'data' node just contains
 * the data, potentially truncated, and the 'meta' node contains some meradata,
 * like the nested objects amount or the url of the API endpoint to get/edit that
 * nested objects.
 */
class ResponseData {

  /**
   * @param {String} baseURL              Base URL (the API url)
   * @param {Array} expands               Nested relations to expand
   * @param {ExpandsURLMap} expandsURLMap Options for the expands (url mappings, etc)
   */
  constructor(baseURL, expands, expandsURLMap) {
    this.baseURL       = baseURL;
    this.expands       = expands;
    this.expandsURLMap = expandsURLMap || {};
    this.data          = null;
  }


  /**
   * @param  {mixed} data   Object or array of objects to return from the database
   * @return {ResponseData} It returns itself so the call can be chained
   */
  setData(data) {
    this.data = data;

    // make the method chainable
    return this;
  }


  /**
   * @return {Object} the formatted 'data' node
   */
  toJSON() {
    var formatedData = {};

    if(this.data) {
      if(Array.isArray(this.data)) {
        let that = this;
        formatedData = [];

        this.data.forEach(function(item) {
          formatedData.push(that._formatItem(item, that.expands, 0));
        });
      } else if(this.data.getRefs) {
        formatedData = this._formatItem(this.data, this.expands, 0);
      } else {
        formatedData = this.data;
      }
    }

    return formatedData;
  }


  // Aux. private methods
  // --------------------------------------------------------------------

  /**
   * Formats one entity by expanding/collapsing the relations as requested
   * with the corresponding meta/data nodes for the relations
   *
   * @param  {Model} item     The entity to format
   * @param  {Array} expands  Relations to expand
   * @param  {Array} stack    Current nesting level
   * @return {Object}         The formatted entity
   */
  _formatItem(item, expands, stack) {

    stack = stack || [];

    var
      // model refs
      expandable = item.getRefs(),

      // model attributes that will be expanded
      willExpand = _.pick(item, expands),

      // model attributes that will remain unexpanded
      willNotExpand = _.pick(item,
        _.difference(expandable, _.keys(willExpand))
      ),

      // pick the 'regular' fields (non refs)
      ret = _.omit(item.toJSON(), expandable);

    // add the unexpanded nested data
    for(let attr in willNotExpand) {
      let newStack = stack.concat([attr]);
      ret[attr] = {
        meta: this._getNestedMeta(willNotExpand[attr], newStack, item._id)
      };
    }

    // add the expanded nested data
    for(let attr in willExpand) {
      let newStack = stack.concat([attr]);
      ret[attr] = {
        meta: this._getNestedMeta(willExpand[attr], newStack, item._id),
        data: this._formatNestedData(willExpand[attr], this._getNestedExpands(attr, expands), newStack)
      };
    }

    return ret;
  }


  /**
   * Formats one of the entity relations
   *
   * @param  {mixed} nestedData     The nested data (can be a model or an array of them)
   * @param  {Array} nestedExpands  Expands for that level
   * @param  {Array} stack          Current nesting level
   * @return {mixed}                The formatted relations (can be an object or an array of them)
   */
  _formatNestedData(nestedData, nestedExpands, stack) {
    var ret;

    if(Array.isArray(nestedData)) {
      let that = this;
      ret = nestedData.map(function(nestedItem) {
        return that._formatItem(nestedItem, nestedExpands, stack);
      });
    } else {
      ret = this._formatItem(nestedData, nestedExpands, stack);
    }

    return ret;
  }


  /**
   * Formats the meta node for a nested relation
   *
   * @param  {mixed}    data     The relation data
   * @param  {Array}    stack    Current nesting level
   * @param  {ObjectId} parentId Parent entity Id
   * @return {Object}            The relation 'meta' node
   */
  _getNestedMeta(data, stack, parentId) {
    var url = this.expandsURLMap.getRoute(stack.join('/'));

    if(url) {
      url = this.baseURL + url;

      // replace any item ids placeholders with the obj. ids
      url = url.replace(/:parentId/g, parentId);

      if(url.indexOf(':itemId') > -1) {
        if(!data) {
          url = '';
        } else {
          let itemId;
          if(data._id) {
            itemId = data._id;
          } else if('toHexString' in data) {
            itemId = data;
          } else {
            itemId  = null;
          }

          url = itemId ? url.replace(/:itemId/g, itemId): '';
        }
      }
    } else {
      url = '';
    }

    return {
      count: this._getItemCount(data),
      url: url
    };
  }


  /**
   * @param {String} attr    Entity attribute that contains the nested data
   * @param {Array}  expands Entity attributes to expand
   * @return {Array}         The attributes to expand on that attr., (false if none)
   */
  _getNestedExpands(attr, expands) {
    return _.compact(expands.map(function(expand) {
      var expandParts = expand.split('.');
      if(expandParts.length > 1 && expandParts[0] === attr) {
        return expandParts.slice(1).join('.');
      } else {
        return false;
      }
    }));
  }


  /**
   * @param {mixed} attrVal The data for some attribute that contains related data
   * @return {Number}       The amount of nested entities for a given attribute
   */
  _getItemCount(attrVal) {
    if(Array.isArray(attrVal)) {
      return attrVal.length;
    } else {
      return attrVal ? 1 : 0;
    }
  }

}


module.exports = ResponseData;
