var express = require("express");
var app = new express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var Log = require("log");
  log = new Log("debug")
var port = process.env.PORT || 3000;
//app.use(express.static(__dirname  + "/public"));
var router = express.Router();
router.get('/emettre/:channel/:user', function(req, res) {
    res.render('emettre.ejs', {channel: req.params.channel, user: req.params.user});
});
router.get('/visualiser/:channel', function(req, res) {
    res.render('visualiser.ejs', {channel: req.params.channel});
});
router.get('/', function(req, res) {
    res.render('index.ejs');
});
app.use('/', router);
// app.get('/', function(req,res){
//   res.redirect('index.html');
// });
var channels = [];

for (var ii=1; ii<=2; ii++) {
  channels[ii] = io.of('/' + ii);
  channels[ii].on('connection', function(socket){
    for (var jj=1; jj<=3; jj++) {
      socket.on('stream-' + jj, function(image){
        socket.broadcast.emit('stream-' + jj, image)
      });
    }
  });
}

http.listen(port, function(){
  log.info('Serveur à l\'écoute du port %s', port)
});
