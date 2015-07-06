'use strict';

var
  _                 = require('underscore'),
  async             = require('async'),
  objectid          = require('mongodb').ObjectID,

  mongoose          = require('mongoose'),
  mongoConfigParser = require('src/lib/mongoConfigParser'),

  // test dependencies
  mocha             = require('mocha'),
  expect            = require('chai').expect,
  requireHelper     = require('test/require_helper'),

  // other
  Article           = require('src/modules/api/models/blog/Article'),
  Tag               = require('src/modules/api/models/blog/Tag'),

  // file to test
  ArticleTagsUtil   = requireHelper('modules/api/util/ArticleTagsUtil');


describe('modules/api/util/ArticleTagsUtil', function() {

  var existingTag;

  before(function(done) {
    var mongoConn = new mongoConfigParser().setEnv({
      host     : process.env.MONGO_HOST,
      port     : process.env.MONGO_PORT,
      user     : process.env.MONGO_USER,
      password : process.env.MONGO_PASSWORD,
      database : process.env.MONGO_DATABASE
    });
    mongoose.connect(mongoConn.getConnectionString(), mongoConn.getConnectionOptions());
    mongoose.connection.once('open', function() {

      existingTag = new Tag({
        name:  'some-new-tag-0',
        slug:  'some-new-tag-0',
        owner: objectid('000000000000000000000001'),
      });

      existingTag.save(function(err) {
        if(err) {
          console.log(err);
        }
        done();
      });
    });
  });


  after(function(done) {
    existingTag.remove(function() {
      mongoose.connection.close(done);
    });
  });


  describe('_createUnexistingTags', function() {

    it('should create only the tags without id', function(done) {

      var
        articleModel = {
          id:       objectid('000000000000000000000001'),
          owner:    objectid('000000000000000000000001'),
          tags:     [existingTag.id]
        },
        tagsToAssign = [
          { id: existingTag.id },                       // a preexisting one
          { id: objectid('000000000000000000000002') }, // one with an id that does not exist
          { name: 'some-new-tag-1' },                   // a new tag
          { name: 'some-new-tag-2' }                    // another new tag
        ];

      ArticleTagsUtil._createUnexistingTags(articleModel, tagsToAssign, function(err, model) {

        expect(err).to.be.null;

        async.parallel([

          function(cb) {
            // tag 2 should not exist
            Tag.find({_id: '000000000000000000000002'}, function(err, model) {
              expect(err).to.be.null;
              expect(model.length).to.equal(0);
              cb();
            });
          },

          function(cb) {
            // tag 3 & 4 should exist
            Tag.find({name: {$in: ['some-new-tag-1','some-new-tag-2']}}, function(err, models) {
              expect(err).to.be.null;
              expect(models.length).to.equal(2);
              models.forEach(function(model) {
                model.remove();
              });
              cb();
            });
          }
        ], done);
      });
    });

  });


  describe('_updateTagsArticles', function() {

    it('should invoke the callback if there\'s nothing to do', function(done) {
      var
        articleModel = {
          id:       objectid('000000000000000000000001'),
          owner:    objectid('000000000000000000000001')
        },
        tagsToAssign = [];

      ArticleTagsUtil._updateTagsArticles(articleModel, tagsToAssign, function(err, model) {
        expect(model.tags).to.be.undefined;
        done();
      });
    });


    it('should link the tag to the article', function(done) {
      var
        articleModel = {
          id:       objectid('000000000000000000000001'),
          owner:    objectid('000000000000000000000001')
        },
        tagsToAssign = [existingTag];

      ArticleTagsUtil._updateTagsArticles(articleModel, tagsToAssign, function(err, model) {
        Tag.find({_id: existingTag._id}, function(err, models) {
          expect(models[0].articles.length).to.equal(1);
          expect(models[0].articles[0].toString()).to.equal(articleModel.id.toString());
          done();
        });
      });
    });


    it('should unlink the tag to the article', function(done) {
      var
        articleModel = {
          id:       objectid('000000000000000000000001'),
          owner:    objectid('000000000000000000000001'),
          tags:     [existingTag]
        },
        tagsToAssign = [];

      ArticleTagsUtil._updateTagsArticles(articleModel, tagsToAssign, function(err, model) {
        Tag.find({_id: existingTag._id}, function(err, models) {
          expect(models[0].articles.length).to.equal(0);
          done();
        });
      });
    });

  });


  describe('_updateArticleTags', function() {

    it('should update the tags on the article', function(done) {
      var
        articleModel = new Article({
          id:       objectid('000000000000000000000001'),
          owner:    objectid('000000000000000000000001'),
          articles: []
        }),
        tagsToAssign = [
          { id: objectid('000000000000000000000001') },
          { id: objectid('000000000000000000000002') }
        ];

      ArticleTagsUtil._updateArticleTags(articleModel, tagsToAssign, function(err, model) {
        expect(model).to.have.property('tags');
        expect(model.tags.length).to.equal(2);

        expect( model.tags.indexOf('000000000000000000000001') > -1 ).to.be.true;
        expect( model.tags.indexOf('000000000000000000000002') > -1 ).to.be.true;

        done();
      });
    });

  });


  describe('setArticleTags', function() {

    it('should accept an array of tags', function(done) {
      var
        articleModel = new Article({
          id:       objectid('000000000000000000000001'),
          owner:    objectid('000000000000000000000001'),
          articles: []
        }),
        tagsToAssign = [
          { id: objectid('000000000000000000000001') },
          { id: objectid('000000000000000000000001') },
          { name: 'foo' },
          { name: 'foo' }
        ];

      ArticleTagsUtil.setArticleTags(articleModel, tagsToAssign, function(err, model) {
        expect(err).to.be.null;
        done();
      });
    });


    it('should accept a single tags', function(done) {
      var
        articleModel = new Article({
          id:       objectid('000000000000000000000001'),
          owner:    objectid('000000000000000000000001'),
          articles: []
        }),
        tagsToAssign = { id: objectid('000000000000000000000001') };

      ArticleTagsUtil.setArticleTags(articleModel, tagsToAssign, function(err, model) {
        expect(err).to.be.null;
        done();
      });
    });

  });


  describe('setTagArticles', function() {

    it('should do nothing if there is no change in the articles', function(done) {
      var tagModel = new Tag();

      tagModel.set({
        owner:    objectid('000000000000000000000001'),
        id:       objectid('000000000000000000000012'),
        name:     'setTagArticlesTestTag-0',
        slug:     'set-tag-articles-test-tag-0'
      });

      tagModel.save(function(err, model) {
        ArticleTagsUtil.setTagArticles(model, [], function(err, tag) {
          expect(err).to.be.null;
          done();
        });
      });
    });


    it('should link and unlink the articles', function(done) {
      var tagModel, articleModel1, articleModel2;

      async.series([

        function(cb) {
          (new Article({
            owner:    objectid('000000000000000000000001'),
            author:   objectid('000000000000000000000001'),
            id:       objectid('000000000000000000000009'),
            title:   'Some article1',
            slug:    'some-article-00000000001'
          })).save(function(err, model) {
            if(err) { return cb(err); }
            articleModel1 = model;
            cb();
          });
        },

        function(cb) {
          (new Tag({
            owner:    objectid('000000000000000000000001'),
            id:       objectid('000000000000000000000008'),
            name:     'setTagArticlesTestTag',
            slug:     'set-tag-articles-test-tag',
            articles: ['000000000000000000000009']
          })).save(function(err, model) {
            if(err) { return cb(err); }
            tagModel = model;
            cb();
          });
        },

        function(cb) {
          (new Article({
            owner:    objectid('000000000000000000000001'),
            author:   objectid('000000000000000000000001'),
            id:       objectid('000000000000000000000010'),
            title:   'Some article2',
            slug:    'some-article-00000000002'
          })).save(function(err, model) {
            if(err) { return cb(err); }
            articleModel2 = model;
            cb();
          });
        }

      ], function(err) {
        expect(err).to.be.null;

        if(err) {
          console.log(err);
          done();
        }

        ArticleTagsUtil.setTagArticles(tagModel, [articleModel2], function(err, tag) {
          expect(err).to.be.null;

          async.series([

            function(cb) {
              tag.populate('articles', function(err, model) {
                expect(model.articles.length).to.equal(1);
                expect(model.articles[0].title).to.equal('Some article2');
                cb();
              });
            },

            function(cb) {
              Article.findOne(articleModel1._id).populate('tags').exec(function(err, model) {
                expect(model.tags.length).to.equal(0);
                cb();
              });
            },

            function(cb) {
              Article.findOne(articleModel2._id).populate('tags').exec(function(err, model) {
                expect(model.tags.length).to.equal(1);
                expect(model.tags[0].name).to.equal('setTagArticlesTestTag');
                cb();
              });
            }

          ], function(err) {
            expect(err).to.be.null;

            if(err) {
              console.log(err);
              done();
            }
            done();
          });

        });
      });
    });

  });

});
