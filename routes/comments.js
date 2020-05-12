const express = require('express');
const router = express.Router({ mergeParams: true });
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

//Comment Routes
router.get('/blogs/:id/comments/new', isLoggedIn, (req, res) => {
  Blog.findOne({ _id: req.params.id }, (err, blog) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/comment', { blog: blog });
    }
  })
});

router.post('/blogs/:id/comments', isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log('Failed to find a blog');
    } else {
      const comment = req.body.comment;
      Comment.create(comment, (err, comment) => {
        if (err) {
          console.log('Failed to create a comment');
        } else {
          blog.comments.push(comment);
          blog.save((err, blog) => {
            if (err) {
              console.log('Failed to add comment to the blog!');
            } else {
              console.log(blog);
              res.redirect('/blogs');
            }
          })
        }
      })
    }
  })
})


//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}


module.exports = router;