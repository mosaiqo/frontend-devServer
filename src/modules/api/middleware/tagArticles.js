module.exports = function(req, res, next) {
  if(req.params.articleId) {
    var articles = req.body.articles || '[]';
    try {
      var
        parsedArticles = JSON.parse(articles),
        thisArticle    = {'id': req.params.articleId};

      if(Array.isArray(parsedArticles)) {
        parsedArticles.push(thisArticle);
      } else {
        parsedArticles = [thisArticle, parsedArticles];
      }

      req.body.articles = JSON.stringify(parsedArticles);
    } catch(e) {}
  }
  next();
};
