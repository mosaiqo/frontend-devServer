/* global require, module, process, console, __dirname */
/* jshint -W097 */
module.exports = (function() {
  'use strict';

  var
    faker = require('faker'),
    data = [];


  for(var i=0, l=100; i < l; i++) {
    data.push({
      "name"        : faker.lorem.words(Math.floor(Math.random() * 4) + 1).join(' '),
      "description" : faker.lorem.sentence(),
      "url"         : faker.image.cats(),
      "active"      : Math.random() > 0.5
    });
  }

  return data;

})();
