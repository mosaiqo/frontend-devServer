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
      // transform _id to id
      ret.id = ret._id;
      delete ret._id;
    }
  },
  toObject: {
    transform: /* istanbul ignore next */ function(doc, ret) {
      // transform id to _id
      ret._id = ret.id;
      delete ret.id;
    }
  }

});

module.exports = mongoose.model('Media', MediaSchema);
