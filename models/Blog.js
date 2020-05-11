const mongoose = require('mongoose');

//Blog Schema 
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
})

module.exports = mongoose.model('Blog', blogSchema);