/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  mongoose = require('mongoose'),
  Schema   = mongoose.Schema,
  dateUtil = require('src/lib/dateUtil');


var TagSchema = new Schema({
  name         : { type: String, required: true }, // unique per user too
  slug         : { type: String, unique: true },
  description  : String,

  owner        : { type: Schema.ObjectId, ref: 'User', required: true },
  created_at   : { type: Date, default: Date.now },
  updated_at   : { type: Date, default: Date.now }
}, {

  toJSON: {
    transform: function(doc, ret) {
      // transform _id to id
      ret.id = ret._id;
      delete ret._id;

      // filter out some attributes from the output
      delete ret.owner;
      delete ret.__v;

      // convert the dates to timestamps
      ret.created_at   = dateUtil.dateToTimestamp(ret.created_at);
      ret.updated_at   = dateUtil.dateToTimestamp(ret.updated_at);
    }
  },
  toObject: {
    transform: /* istanbul ignore next */ function(doc, ret) {
      // transform id to _id
      ret._id = ret.id;
      delete ret.id;

      // convert the timestamps to dates
      if(ret.created_at) {
        ret.created_at = dateUtil.timestampToDate(ret.created_at);
      }

      if(ret.updated_at) {
        ret.updated_at = dateUtil.timestampToDate(ret.updated_at);
      }
    }
  },

  'collection': 'blog.tags'

});


TagSchema.plugin( require('mongoose-paginate') );

module.exports = mongoose.model('BlogTag', TagSchema);
