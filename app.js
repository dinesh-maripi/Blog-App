const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Blog = require('./models/Blog');
const Comment = require('./models/Comment');
const User = require('./models/User');
const seedDB = require('./seeds');
const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');


const app = express();

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

//App config
seedDB();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(expressSession({
  secret: 'The quick brown fox has jumped over a lazy dog.',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Authentication Routes

//Registrations routes
app.get('/register', (req, res) => {
  res.render('user/register');
})

app.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.log('Failed to register user!');
    } else {
      passport.authenticate('local')(req, res, (err, user) => {
        if (err) {
          console.log('Passport failed authenticate the user');
        } else {
          res.redirect('/blogs');
        }
      })
    }
  })
})

//Login routes
app.get('/login', (req, res) => {
  res.render('user/login');
})

//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

app.post('/login', passport.authenticate('local', {
  successRedirect: '/blogs',
  failureRedirect: '/login'
}), (req, res) => { })

//logout routes
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
})


//Root route
app.get('/', (req, res) => {
  res.redirect('/blogs');
})

//Index route
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render('blogs/index', { blogs: blogs });
    }
  })
})

//New route
app.get('/blogs/new', isLoggedIn, (req, res) => {
  res.render('blogs/new');
})

app.post('/blogs', isLoggedIn, (req, res) => {
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
app.get('/blogs/:id', isLoggedIn, (req, res) => {
  Blog.findById(req.params.id).populate('comments').exec((err, blog) => {
    if (err) {
      console.log('Blog not found!');
    } else {
      res.render('blogs/show', { blog: blog });
    }
  })
})

//edit route
app.get('/blogs/:id/edit', isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(err);
    } else {
      res.render('blogs/edit', { blog: blog });
    }
  })
})

app.put('/blogs/:id', isLoggedIn, (req, res) => {
  Blog.findOneAndUpdate({ _id: req.params.id }, req.body.blog, (err, updateBlog) => {
    if (err) {
      console.log('Failed to update the blog!')
    } else {
      res.redirect('/blogs')
    }
  })
})

//Delete route
app.delete('/blogs/:id/', isLoggedIn, (req, res) => {
  Blog.findOneAndDelete({ _id: req.params.id }, (err, deletedBlog) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/blogs');
    }
  })
})

//Comment Routes
app.get('/blogs/:id/comments/new', isLoggedIn, (req, res) => {
  Blog.findOne({ _id: req.params.id }, (err, blog) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/comment', { blog: blog });
    }
  })
});

app.post('/blogs/:id/comments', isLoggedIn, (req, res) => {
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

app.listen(3000, () => console.log('Server started listening at port 3000'));