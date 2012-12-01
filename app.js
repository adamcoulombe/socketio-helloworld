var app = require('express').createServer()
  , io = require('socket.io').listen(app);

app.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	
  socket.emit('greeting', { message: 'welcome' });

  
  socket.on('clicker clicked', function (data) {
    socket.emit('update page', { message: 'hello' + data.myname });
  });
  
});