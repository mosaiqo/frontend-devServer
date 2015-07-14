'use strict';

var
  mongoose = require('mongoose'),
  Schema   = mongoose.Schema,
  dateUtil = require('src/lib/dateUtil'),
  Tag;


var ArticleSchema = new Schema({
  title        : { type: String, required: true },
  slug         : { type: String, required: true, default: 'slug' },
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
      if(ret.published_at) {
        ret.published_at = dateUtil.timestampToDate(ret.published_at);
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


// Remove relations from other collections
ArticleSchema.pre('remove', function (next) {
  var
    article  = this,
    criteria = { _id: {$in: article.tags}, owner: article.owner },
    update   = { $pull: { 'articles': article._id } };


  if(!article.tags.length) {
    next();
  } {
    // requiring at runtime to avoid circular dependencies
    Tag = Tag || require('./Tag');

    Tag.update(criteria, update, {multi:true}, function(err, numAffected) {
      /* istanbul ignore next */
      if(err) { return next(err); }
      next();
    });
  }
});


// Secondary indexes
// ----------------------------------
ArticleSchema.index({ tags: 1 });

// slug must be unique for a given client
ArticleSchema.index({ owner: 1, slug: 1}, { unique: true });


// Custom methods and attributes
// ----------------------------------
ArticleSchema.statics.safeAttrs = ['title', 'excerpt', 'body', 'published', 'published_at', 'commentable'];
ArticleSchema.methods.getRefs = function() { return ['tags', 'author']; };


// Register the plugins
// ----------------------------------
ArticleSchema.plugin( require('mongoose-paginate') );
ArticleSchema.plugin( require('mongoose-deep-populate') );
ArticleSchema.plugin( require('mongoose-time')() );


/* istanbul ignore next */
var BlogArticleModel = mongoose.models.BlogArticle ?
  mongoose.model('BlogArticle') : mongoose.model('BlogArticle', ArticleSchema);


module.exports = BlogArticleModel;
