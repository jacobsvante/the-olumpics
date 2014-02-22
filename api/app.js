var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var mysql = require('mysql');
var _ = require('lodash-node');

var gameData = {};
var gameidCounter = 0;
var useridCounter = 0;

//Database connection credentials
var dbConnection = mysql.createConnection({
    host    : 'localhost',
    port    : 8889,
    user    : 'root',
    password: 'root'
});

server.listen(8080);

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
			fighters = getRandomFighters(3, function(fighters) {
				socket.emit('fighter.suggestions', fighters);
			});
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
});

//Connect to db
function queryDB(query, callback) {
    'use strict';
    dbConnection.connect();

    dbConnection.query(query, function(err, rows, fields) {
        if (err) throw err;

        //console.log('The solution is: ', rows[0]);
        callback(rows);
    });

    dbConnection.end();
}

function getRandomFighters(num, callback) {
	//Get 3 random fighters from DB.
	queryDB('SELECT PERNR, INST FROM insark.test WHERE PERNR LIKE "70%" ORDER BY RAND() LIMIT '+num, function(data) {
	//queryDB('SELECT * FROM insark.test LIMIT 1', function(data){
	    'use strict';
	    callback(data);
	});
}