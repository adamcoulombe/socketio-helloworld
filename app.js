var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , db_url = process.env.MONGOHQ_URL   // heroku does this automatically. Locally, use bash command: export MONGOHQ_URL=mongodb://user:pass@server.mongohq.com/db_name
  , db = require('mongoskin').db(db_url,{safe:true});


var port = process.env.PORT || 80;
server.listen(port, function() {
 // console.log("Express server listening on port");
});


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');

	io.sockets.on('connection', function (socket) {
	
	  socket.emit('connection established', { message: 'welcome' });
	
	socket.on('term clicked', function (data) {
		db.collection( "connections" ).findAndModify(
		{"_id":socket.id},
		[],
		{ "$pull":{"terms":data.term || "blank field"}  },
		{new:true},
		function(error, result) {
				if(error){
					console.log("ERROR^^^^^^^ "+error);
				}else{
					console.log(result);
					socket.emit('update page', { terms: result.terms  });
				}
		});
	});
	  
	  socket.on('clicker clicked', function (data) {

		
		db.collection( "connections" ).findAndModify(
		{"_id":socket.id},
		[],
		{ "$push":{"terms":data.term || "blank field"}  },
		{new:true, upsert:true},
		function(error, result) {
				if(error){
					console.log("ERROR^^^^^^^ "+error);
				}else{
					console.log(result);
					socket.emit('update page', { terms: result.terms  });
				}
		});


	  });
	  
	});


});

