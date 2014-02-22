var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var mysql = require('mysql');

server.listen(8080);

//Database connection credentials
var dbConnection = mysql.createConnection({
    host    : 'localhost',
    port    : 8889,
    user    : 'root',
    password: 'root'
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

//Get 3 random fighters from DB.
queryDB('SELECT PERNR, INST FROM insark.test WHERE PERNR LIKE "70%" ORDER BY RAND() LIMIT 3', function(data){
//queryDB('SELECT * FROM insark.test LIMIT 1', function(data){
    'use strict';
    console.log(data);
});



app.get('/', function (req, res) {
    'use strict';
    //Serve application, depricated
    //res.sendfile(path.normalize(__dirname + '/../gui/app/index.html'));
    res.send('hej');
});

io.sockets.on('connection', function (socket) {
    'use strict';
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});