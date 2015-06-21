/* global require, module, process, console, __dirname */
/* jshint -W097 */
module.exports = (function() {
  'use strict';

  var
    faker  = require('faker'),
    slug   = require('slug'),
    id     = require('pow-mongodb-fixtures').createObjectId,
    data   = [],

    defaultUserId = id('000000000000000000000001');


  for(var i=0, l=10; i < l; i++) {
    var
      name = faker.lorem.words(1).join(),
      date = faker.date.recent();

    data.push({
      name        : name,
      slug        : slug(name),
      description : faker.lorem.paragraph,
      owner       : defaultUserId,
      created_at  : date,
      updated_at  : date
    });
  }

  return data;

})();
