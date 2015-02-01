var
  mongoose = require('mongoose'),
  Schema   = mongoose.Schema;

var MediaSchema = new Schema({
  name:        String,
  description: String,
  url:         String,
  active:      Boolean
});

module.exports = mongoose.model('Media', MediaSchema);
