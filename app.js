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

const indexRoutes = require('./routes/index');
const blogRoutes = require('./routes/blogs');
const commentRoutes = require('./routes/comments');

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


app.use('/', indexRoutes);
app.use('/blogs/', blogRoutes);
app.use('/blogs/:id/comments', commentRoutes);


//Root route
app.use('/', (req, res) => {
  res.redirect('/blogs');
})

app.listen(3000, () => console.log('Server started listening at port 3000'));