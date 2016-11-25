var express = require("express");
var app = new express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var Log = require("log");
  log = new Log("debug")
var port = process.env.PORT || 3000;
//app.use(express.static(__dirname  + "/public"));
// app.get('/', function(req,res){
//   res.redirect('index.html');
// });
var router = express.Router();
router.get('/emettre/:room', function(req, res) {
    res.render('emettre.ejs', {room: req.params.room});
});
router.get('/visualiser/:room', function(req, res) {
    res.render('visualiser.ejs', {room: req.params.room});
});
router.get('/', function(req, res) {
    res.render('index.ejs');
});
app.use('/', router).use(express.static(__dirname  + "/public"));
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
      socket.broadcast.emit('stream-effect', {room: data.room, effectclass : effect, socketId: socket.id});
    });
  });
  roomIO.on('disconnect', function(socket){
    socket.broadcast.emit('stream-delete', {room: data.room, socketId: socket.id});
  });

  roomsIO.push(roomIO);
}

http.listen(port, function(){
  log.info('Serveur à l\'écoute du port %s', port);
});
