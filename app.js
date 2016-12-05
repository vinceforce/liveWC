var express = require("express");
// var app = new express();
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var Log = require("log");
  log = new Log("debug")
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var expressLayouts = require('express-ejs-layouts');

var routes = require('./routes/index');
var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
// var GoogleStrategy = require('passport-google-auth').Strategy;
var passportConfig = require('./config/passport');
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
.use(logger('dev'))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: false }))
.use(cookieParser())
.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
.use(passport.initialize())
.use(passport.session())
.use(express.static(path.join(__dirname, 'public')))
.use(expressLayouts)
.use('/', routes);


/*

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());

// Google oAuth
passport.use(new GoogleStrategy({
    clientId: '368305440792-d2qe1foo5qojlb3pf68q6f2g7t874094.apps.googleusercontent.com',
    clientSecret: 'YHcq8eYFXMZAA0QfRRyJcKtR',
    callbackURL: 'http://localhost:3000/auth/callback/google'
  },
  function(accessToken, refreshToken, profile, done) {
    Account.register(new Account({ username : profile.sub, name: profile.name, email: profile.email, image: profile.picture}), '12345', function(err, account) {
        if (err) {
          console.log('Erreur après création du profil Google');
          return res.render('index', { error : err.message });
        }

        passport.authenticate('google')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                console.log('Erreur avantredirection suite à création du profil Google');
                res.redirect('/');
            });
        });
        done(err, account);
    });
    // User.findOrCreate({username: profile.info.uid}, function (err, user) {
    //   done(err, user);
    // });
  }
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
*/

// // mongoose
// if (app.get('env') === 'development') {
//   mongoose.connect('mongodb://localhost/liveWC');
// }
// Heroku
mongoose.connect('mongodb://heroku_v1znbgv1:js361a8t7sg7h09i3ujsvoet3r@ds119598.mlab.com:19598/heroku_v1znbgv1');



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;







var rooms = ['/room1', '/room2'];
var roomsIO = [];

for (var ii=0; ii<=1; ii++) {
  var roomIO = io.of(rooms[ii]);
  roomIO.on('connection', function(socket){
    //console.log('roomIO ' + ii);
    socket.on('stream-prepare' , function(data){
      //console.log('stream-prepare ' + data.room);
      socket.emit('stream-id', {room: data.room, socketId: socket.id});
      socket.broadcast.emit('stream-prepare', {room: data.room, socketId: socket.id});
    });
    socket.on('stream' , function(data){
      //console.log("app broadcast emit stream");
      socket.broadcast.emit('stream', data);
    });
    socket.on('stream-effect' , function(data){
      //console.log("app broadcast emit stream");
      socket.broadcast.emit('stream-effect', {room: data.room, effectclass : data.effectclass, socketId: socket.id});
    });
    socket.on('disconnect', function(){
      console.log(socket.id + ' : déconnectée');
      socket.broadcast.emit('stream-delete', {socketId: socket.id});
      // roomIO.emit('stream-delete', {room: rooms[ii], socketId: socket.id});
      console.log(socket.id + ' : message envoyé pour supprimer player');
    });
  });
  // roomIO.on('disconnect', function(socket){
  //   socket.broadcast.emit('stream-delete', {room: data.room, socketId: socket.id});
  // });

  roomsIO.push(roomIO);
}

http.listen(port, function(){
  log.info('Serveur à l\'écoute du port %s', port);
});
