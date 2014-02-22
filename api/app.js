var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

var gameData = {};
var gameidCounter = 0;
var useridCounter = 0;

app.get('/', function (req, res) {
    'use strict';
    //Serve application
    res.cookie('userid', useridCounter++);
    res.sendfile(__dirname + '/gui/app/index.html');
    console.log('Lumps b4 bumps');
});

app.get('/game/challenge/:gameid', function(req, res) {
	//Here we send the user to a specific game.
	res.sendfile(/*Some stuff here. Dom här kopplar till socket*/);
});

io.sockets.on('connection', function(socket) {
	var userid;
	var gameid;

	socket
		.on('user.new', function() {
			userid = useridCounter++;
			socket.emit('user.id', userid);
		})
		.on('game.new', function() {
			gameid = gameidCounter++;
			gameData[gameid] = {};
			gameData[gameid][userid] = {};
			socket.emit('game.id', gameid);
		})
		.on('game.join', function(joinGameid) {
			gameid = joinGameid;
			gameData[gameid][userid] = {};

			if (_.keys(gameData[gameid]).length == 2) {
				socket.broadcast.to(gameid).emit('fighter.select');
			}
		})
		.on('fighter.get_suggestions', function() {
			fighters = getRandomFighters(3);
			socket.emit('fighter.suggestions', fighters);
		})
		.on('fighter.selected', function(fighter) {
			gameData[gameid][userid].fighter = fighter;

			var selectedFighters = [];
			for (var userid in gameData[gameid]) {
				if (gameData[gameid][userid].fighter) {
					selectedFighters.push({
						userid: userid,
						fighter: gameData[gameid][userid].fighter
					});
				}
			}

			if (selectedFighters.length == 2) {
				socket.broadcast.to(gameid).emit('game.start', {
					fighters: selectedFighters
				});
			}
		});
;
});