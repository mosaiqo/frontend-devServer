'use strict';

var
  mongoose = require('mongoose'),
  Schema   = mongoose.Schema,
  dateUtil = require('src/lib/dateUtil'),
  Article;


var TagSchema = new Schema({
  name         : { type: String, required: true },
  slug         : { type: String, required: true, default: 'slug' },
  description  : String,
  articles     : [{ type: Schema.ObjectId, ref: 'BlogArticle'}],
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



// Remove relations from other collections
TagSchema.pre('remove', function (next) {
  var
    tag      = this,
    criteria = { _id: {$in: tag.articles}, owner: tag.owner },
    update   = { $pull: { 'tags': tag._id } };


  if(!tag.articles.length) {
    next();
  } {
    // requiring at runtime to avoid circular dependencies
    Article = Article || require('./Article');

    Article.update(criteria, update, {multi:true}, function(err, numAffected) {
      /* istanbul ignore next */
      if(err) { return next(err); }
      next();
    });
  }
});


// Secondary indexes
// ----------------------------------
TagSchema.index({ articles: 1 });

// name and slug must be unique for a given client
TagSchema.index({ owner: 1, name: 1}, { unique: true });
TagSchema.index({ owner: 1, slug: 1}, { unique: true });


// Custom methods and attributes
// ----------------------------------
TagSchema.statics.safeAttrs = ['name', 'description', 'owner'];
TagSchema.methods.getRefs = function() { return ['articles']; };


// Register the plugins
// ----------------------------------
TagSchema.plugin( require('mongoose-paginate') );
TagSchema.plugin( require('mongoose-deep-populate') );


/* istanbul ignore next */
var BlogTagModel = mongoose.models.BlogTag ?
  mongoose.model('BlogTag') : mongoose.model('BlogTag', TagSchema);


module.exports = BlogTagModel;
