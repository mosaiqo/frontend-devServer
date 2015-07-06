module.exports = function(req, res, next) {
  if(req.params.tagId) {
    var tags = req.body.tags || '[]';
    try {
      var
        parsedTags = JSON.parse(tags),
        thisTag    = {'id': req.params.tagId};

      if(Array.isArray(parsedTags)) {
        parsedTags.push(thisTag);
      } else {
        parsedTags = [parsedTags, thisTag];
      }

      req.body.tags = JSON.stringify(parsedTags);
    } catch(e) {}
  }
  next();
};
