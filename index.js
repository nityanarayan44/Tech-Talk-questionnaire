/*
===================================================
	@Author: Nitya Narayan Gautam [Ashutosh Mishra]
	@Date: 21 jan 2017
	@UI : Polymmer 1.3.0
	@Backend: NodeJs with Socket.IO

	@Description: This application is implementing
	socket.io,
	i developed this application for real time
	Questioning session during any tech-talk or
	seminar without interrupting in mid of time.
===================================================
*/

/*
---------------------------------------------------
	Importing/setting-up libraries.
---------------------------------------------------
*/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*
---------------------------------------------------
	Handling routing for requests
---------------------------------------------------
*/
app.get('/', function(req, res) {
	console.log(">>> ["+ ((new Date()).toString()).substring(0,25) +"] [User : " + req.headers['user-agent'] + "\n\n");
	//console.dir(req.headers);
    res.sendFile(__dirname + '/app/index.html');
});

/*
---------------------------------------------------
	Handling Static Files request
---------------------------------------------------
*/
app.use("/bower_components", express.static(__dirname + "/app/bower_components"));
app.use("/elements", express.static(__dirname + "/app/elements"));
app.use("/images", express.static(__dirname + "/app/images"));
app.use("/scripts", express.static(__dirname + "/app/scripts"));
app.use("/sounds", express.static(__dirname + "/app/sounds"));
app.use("/styles", express.static(__dirname + "/app/styles"));

/*
---------------------------------------------------
	Writing functions for general purpose
---------------------------------------------------
*/
function echoQuestion(obj, socket){
	console.log('\n|````\\');
	console.log('+========================================================================================================================================================+');
	console.log('| HWIP: ' +socket.handshake.address+'');
	console.log('| Time: ' +(new Date())+'');
	console.log('| User: ' +obj.by+'');
	console.log('| Post: ' +obj.query+'');
	console.log('+--------------------------------------------------------------------------------------------------------------------------------------------------------+\n');
}

/*
---------------------------------------------------
	Handling Socket Connection
---------------------------------------------------
*/
function showConnectedInfo(socket){
	console.log("NNG Server Logging.... [User Connected]");
	console.log('>>> Connected IP: [' + socket.handshake.address + ']');
	console.log('>>> Socket ID: ' + socket.id);
	console.log('>>> Total user Connected: ' + socket.server.eio.clientsCount + '\n');
}
function showDisConnectedInfo(socket){
	console.log("NNG Server Logging.... [User Dis-connected]");
	console.log('>>> Disconnected IP: [' + socket.handshake.address + ']');
	console.log('>>> Socket ID: ' + socket.id);
	console.log('>>> User Count: ' + socket.server.eio.clientsCount + '\n');
}

io.on('connection', function(socket) {
	/*Print connections info. */
	socket.id = 'NNG-'+Math.random();
	//showConnectedInfo(socket);

	/*User Dis-connect.*/
	socket.on('disconnect', function(){
		showDisConnectedInfo(socket);
		//console.log(socket);
	});

	/* User sent a message.*/
	socket.on('chat message', function(msg) {
		/* Broadcasting to all users. */
		io.emit('chat message', msg);
		//asked questions.
		echoQuestion(msg, socket);
	});
});
/*
	TODO: Under the socket connection.
	on each connection record the socket id,
	On server end [use var a=new WeakMap()[a.set(key, val), a.get(key)] of ECMAScript6].
	now at client end wrap a property like {From and To} identify the user by using to property from map
	and emit on that socket.
*/

/*
---------------------------------------------------
	Starting Server on specified port...
---------------------------------------------------
*/
http.listen(1800, function() {
    console.log('\n>> Listening on port:1800');
});

/*
---------------------------------------------------
	//TODO Task:
	1: Attach all data to either mongo or sqlite db
---------------------------------------------------
*/
