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
app.use("/scripts", express.static(__dirname + "/app/styles"));
app.use("/scripts", express.static(__dirname + "/app/scripts"));
app.use("/bower_components", express.static(__dirname + "/app/bower_components"));
app.use("/elements", express.static(__dirname + "/app/elements"));

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
	showConnectedInfo(socket);
	
	/*User Dis-connect.*/
	socket.on('disconnect', function(){
		showDisConnectedInfo(socket);
		//console.log(socket);
	});
	
	/* User sent a message.*/
    socket.on('chat message', function(msg) {
		/* Broadcasting to all users. */
        io.emit('chat message', msg);
    });
});

/* 
---------------------------------------------------
	Starting Server on specified port... 
---------------------------------------------------
*/
http.listen(3000, function() {
    console.log('\n>> Listening on port:3000');
});

/* 
---------------------------------------------------
	//TODO Task: 
	1: Attach all data to either mongo or sqlite db
---------------------------------------------------
*/

