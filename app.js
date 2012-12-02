var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var port = process.env.PORT || 80; // Use the port that Heroku provides or default to 5000
server.listen(port, function() {
  console.log("Express server listening on port");
});




app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	
  socket.emit('connection established', { message: 'welcome' });


  
  socket.on('clicker clicked', function (data) {
    socket.emit('update page', { message: 'hello' + data.myname });
  });
  
});