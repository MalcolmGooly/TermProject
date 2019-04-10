/*
    To start this app:
    1. run the command 'node app.js' within the 
    app folder (probably called 'WebVR_Introduction').
    2. Visit localhost:8080/
*/

//app setup
const express   = require('express');
const app       = express();
const http      = require('http');
const server    = http.createServer(app);
const socketIO  = require('socket.io')(server);

//const vars
const LISTEN_PORT = 8080;

//middleware
app.use(express.static(__dirname + '/public'));

//set routes
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

socketIO.on('connection', function(socket) {
    console.log(socket.id + ' has connected!');

    socket.on('disconnect', function(data) {
        console.log(socket.id + ' has disconnected');
    });

});

//!!TRY: create another route to point to another web page

//start server
server.listen(LISTEN_PORT);
console.log('Listening on port: ' + LISTEN_PORT );