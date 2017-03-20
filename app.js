var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var fs = require("fs");
server.listen(process.env.PORT || 3000);

app.get("/", function(req, res){
    res.sendfile(__dirname + "/index.html");
});

io.sockets.on('connection', function(socket){
    console.log("Having connected devices !");
    socket.on('client-send-message', function (data) {
        console.log("Client has send message : " + data);
    });

});

var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var url = 'mongodb://localhost:27017/ChatSocket';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db.close();
});


// server.use('/api/users', require('./api/users'));

// server.get('/', (req, res) => {
//     res.send('Hello World');
// });

// MongoClient.connect(config.database.url, { promiseLibrary: Promise }, (err, db) => {
//   if (err) {
//     logger.warn(`Failed to connect to the database. ${err.stack}`);
//   }
//   server.locals.db = db;
//   server.listen(PORT, () => {
//     const { address, port }  = server.address();
//     logger.info(`Node.js server is listening at http://${address}:${port}`);
//   });
// });