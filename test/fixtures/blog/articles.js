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
      title = faker.lorem.sentence(),
      body  = faker.lorem.paragraphs(6),
      date  = faker.date.recent();

    data.push({
      title        : title,
      slug         : slug(title),
      excerpt      : body.split('\n \r\t')[0],
      body         : body,
      author       : defaultUserId,
      owner        : defaultUserId,
      published    : true,
      published_at : date,
      commentable  : true,
      created_at   : date,
      updated_at   : date
    });
  }

  return data;

})();
