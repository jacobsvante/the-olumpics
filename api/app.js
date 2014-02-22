var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function (req, res) {
    'use strict';
    //Serve application
    res.sendfile(__dirname + '/gui/app/index.html');
    console.log('Be gone foul woman!');
});
/*
io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});
*/