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
   *
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
   *
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
      } else {
        formatedData = this._formatItem(this.data, this.expands, 0);
      }
    }

    return formatedData;
  }


  // Aux. private methods
  // --------------------------------------------------------------------

  /**
   *
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
        meta: this._getNestedMeta(willNotExpand[attr], attr, newStack, item._id)
      };
    }

    // add the expanded nested data
    for(let attr in willExpand) {
      let newStack = stack.concat([attr]);
      ret[attr] = {
        meta: this._getNestedMeta(willExpand[attr], attr, newStack, item._id),
        data: this._formatNestedData(willExpand[attr], this._getNestedExpands(attr, expands), newStack)
      };
    }

    return ret;
  }


  /**
   *
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
   *
   */
  _getNestedMeta(data, attr, stack, parentId) {
    var url = this.expandsURLMap.getRoute(stack.join('/'));

    if(url) {
      url = this.baseURL + url;

      // replace any item ids placeholders with the obj. ids
      url = url.replace(/:parentId/g, parentId);

      if(url.indexOf(':itemId') > -1) {
        let itemId  = null;
        if(data._id) {
          itemId = data._id;
        } else if('toHexString' in data) {
          itemId = data;
        }

        if(itemId) {
          url = url.replace(/:itemId/g, itemId);
        }
      }
    }

    return {
      count: this._getItemCount(data),
      url: url
    };
  }


  /**
   *
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
   *
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
