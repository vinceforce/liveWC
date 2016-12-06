var express = require("express");
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

// Emission / réception de vidéo
router.get('/emettre/:room', function(req, res) {
  res.locals = {user: req.user, anonymousContent: false};
  res.render('emettre', {room: req.params.room, user : req.user, error : ''});
})
.get('/visualiser/:room', function(req, res) {
  res.locals = {user: req.user, anonymousContent: false};
  res.render('visualiser', {room: req.params.room, user : req.user, error : ''});
})
// Page d'accueil
.get('/', function (req, res) {
  res.locals = {user: req.user, anonymousContent: false};
  res.render('index', { user : req.user, error : '' });
})
// Gestion utilisateurs locaux
.get('/register', function(req, res) {
  res.locals = {user: req.user, anonymousContent: true};
  res.render('register', { error : '', user: '' });
})
.post('/register', function(req, res, next) {
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.render('register', { error : err.message });
    }
    passport.authenticate('local')(req, res, function () {
      req.session.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
})
.get('/login', function(req, res) {
  res.locals = {user: req.user, anonymousContent: true};
  res.render('login', { user : '', error : '', pubshow: true });
})
.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
})
// route for showing the Google profile page
.get('/profile', isLoggedIn, function(req, res) {
  res.locals = {user: req.user, anonymousContent: false};
  res.render('profile', {
      user : req.user, // get the user out of session and pass to template
      error : '',
      pubshow: true
  });
})
// login Google
.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }))

// the callback after google has authenticated the user
.get('/auth/callback/google',
        passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
        }
))

.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})
.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
