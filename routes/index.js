const express = require('express');
const router = express.Router();

const User = require('../models/User');
const passport = require('passport');


//Registrations routes
router.get('/register', (req, res) => {
  res.render('user/register');
})

router.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.log(`Failed to register user! with name ${req.body.username}`);
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
router.get('/login', (req, res) => {
  res.render('user/login');
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/blogs',
  failureRedirect: '/login'
}), (req, res) => { })

//logout routes
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
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