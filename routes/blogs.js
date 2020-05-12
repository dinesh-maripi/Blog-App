const express = require('express');
const router = express.Router();

const Blog = require('../models/Blog');

//Root route
router.get('/', (req, res) => {
  res.redirect('/blogs');
})

//Index route
router.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render('blogs/index', { blogs: blogs });
    }
  })
})

//New route
router.get('/blogs/new', isLoggedIn, (req, res) => {
  res.render('blogs/new');
})

router.post('/blogs', isLoggedIn, (req, res) => {
  const blog = req.body.blog;
  // console.log(blog);
  Blog.create(blog, (err, newBlog) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/blogs');
    }
  })
})


//Show route
router.get('/blogs/:id', isLoggedIn, (req, res) => {
  Blog.findById(req.params.id).populate('comments').exec((err, blog) => {
    if (err) {
      console.log('Blog not found!');
    } else {
      res.render('blogs/show', { blog: blog });
    }
  })
})

//edit route
router.get('/blogs/:id/edit', isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(err);
    } else {
      res.render('blogs/edit', { blog: blog });
    }
  })
})

router.put('/blogs/:id', isLoggedIn, (req, res) => {
  Blog.findOneAndUpdate({ _id: req.params.id }, req.body.blog, (err, updateBlog) => {
    if (err) {
      console.log('Failed to update the blog!')
    } else {
      res.redirect('/blogs')
    }
  })
})

//Delete route
router.delete('/blogs/:id/', isLoggedIn, (req, res) => {
  Blog.findOneAndDelete({ _id: req.params.id }, (err, deletedBlog) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/blogs');
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

