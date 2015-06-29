'use strict';

module.exports = function(data, meta, errors) {

  if(errors) {
    return {
      error: errors
    };
  } else {

    return {
      meta: meta || {},
      data: data || {}
    };
  }
};
