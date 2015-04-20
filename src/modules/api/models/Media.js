/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  mongoose = require('mongoose'),
  Schema   = mongoose.Schema;

var MediaSchema = new Schema({
  name:        String,
  description: String,
  url:         String,
  active:      Boolean
}, {

  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      ret._id = ret.id;
      delete ret.id;
    }
  }

});

module.exports = mongoose.model('Media', MediaSchema);
