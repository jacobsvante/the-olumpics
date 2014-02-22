var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var mysql = require('mysql');
var _ = require('lodash-node');

var gameData = {};
var gameidCounter = 1;
var useridCounter = 1;

//Database connection credentials
var dbConnection = mysql.createConnection({
    host    : 'localhost',
    port    : 8889,
    user    : 'root',
    password: 'root'
});

dbConnection.connect();

server.listen(8080);

app.get('/game/challenge/:gameid', function(req, res) {
	'use strict';
	//Here we send the user to a specific game.
	res.sendfile(/*Some stuff here. Dom här kopplar till socket*/);
});

io.sockets.on('connection', function(socket) {
	'use strict';
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
			socket.join(gameid);
			socket.emit('game.id', gameid);
		})
		.on('game.join', function(joinGameid) {
			gameid = joinGameid;
			if ( ! gameData[gameid]) {
				gameData[gameid] = {};
			}
			gameData[gameid][userid] = {};
			socket.join(gameid);

			if (_.keys(gameData[gameid]).length === 2) {
				io.sockets.in(gameid).emit('fighter.select');
			}
		})
		.on('fighter.get_suggestions', function() {
			getRandomFighters(3, function(fighters) {
				socket.emit('fighter.suggestions', fighters);
			});
		})
		.on('fighter.selected', function(fighter) {
			gameData[gameid][userid].fighter = fighter;

			var selectedFighters = [];
			for (var userid2 in gameData[gameid]) {
				if (gameData[gameid][userid2].fighter) {
					selectedFighters.push({
						userid: userid2,
						fighter: gameData[gameid][userid2].fighter
					});
				}
			}

			if (selectedFighters.length === 2) {
				socket.broadcast.to(gameid).emit('game.start', {
					fighters: selectedFighters
				});
			}
		})

		.on('disconnect', function(){
			if(userid && gameid && gameData[gameid][userid]) {
				delete gameData[gameid][userid];
			}
			
		});
});

//Connect to db
function queryDB(query, callback) {
    'use strict';

    dbConnection.query(query, function(err, rows, fields) {
        if (err) throw err;

        //console.log('The solution is: ', rows[0]);
        callback(rows);
    });
}

function getRandomFighters(num, callback) {
	//Get 3 random fighters from DB.
	queryDB('SELECT PERNR, STPI_STP1 AS logic, STPI_STP2 AS intelligence, STPI_STP3 AS shape, STPI_STP4 AS tech FROM insark.test WHERE PERNR LIKE "7%" AND STPI_STP4 != 0 ORDER BY RAND() LIMIT '+num, function(data) {
	//queryDB('SELECT * FROM insark.test LIMIT 1', function(data){
	    'use strict';
	    callback(data);
	});
}