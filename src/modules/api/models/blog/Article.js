/* global require, module, process, console, __dirname */
/* jshint -W097 */
'use strict';

var
  mongoose = require('mongoose'),
  Schema   = mongoose.Schema,
  dateUtil = require('src/lib/dateUtil'),

  User = require('../User'),
  Tag  = require('./Tag');


var ArticleSchema = new Schema({
  title        : { type: String, required: true },
  slug         : { type: String, required: true },
  excerpt      : String,
  body         : String,
  commentable  : { type: Boolean, default: false},

  author       : { type: Schema.ObjectId, ref: 'User', required: true },
  owner        : { type: Schema.ObjectId, ref: 'User', required: true },

  tags         : [{ type: Schema.ObjectId, ref: 'BlogTag' }],

  published    : { type: Boolean, default: false},
  published_at : { type: Date, default: Date.now },

  created_at   : { type: Date, default: Date.now },
  updated_at   : { type: Date, default: Date.now }
}, {

  toJSON: {
    transform: function(doc, ret) {
      // transform _id to id
      ret.id = ret._id;
      delete ret._id;

      // transform published_at to publish_date (WHY ARE WE USING publish_date?)
      ret.publish_date = ret.published_at;
      delete ret.published_at;

      // filter out some attributes from the output
      delete ret.owner;
      delete ret.__v;

      // convert the dates to timestamps
      ret.created_at   = dateUtil.dateToTimestamp(ret.created_at);
      ret.updated_at   = dateUtil.dateToTimestamp(ret.updated_at);
      ret.publish_date = dateUtil.dateToTimestamp(ret.publish_date);
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

      if(ret.published_at) {
        ret.published_at = dateUtil.timestampToDate(ret.published_at);
      }

      if(ret.updated_at) {
        ret.updated_at = dateUtil.timestampToDate(ret.updated_at);
      }

      // convert the author id to an ObjectId
      if(ret.author) {
        ret.author = mongoose.Types.ObjectId(ret.author);
      } else {
        ret.author = null;
      }
    }
  },

  'collection': 'blog.articles'

});


// Secondary indexes
// ------------------------
ArticleSchema.index({ tags: 1 });

// slug must be unique for a given client
ArticleSchema.index({ owner: 1, slug: 1}, { unique: true });


// Register the plugins
// ------------------------
ArticleSchema.plugin( require('mongoose-paginate') );


module.exports = mongoose.model('BlogArticle', ArticleSchema);
