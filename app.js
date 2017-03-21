var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var fs = require("fs");

var router = express.Router();

server.listen(process.env.PORT || 3000);

app.get("/", function (req, res) {
    res.sendfile(__dirname + "/index.html");
});

io.sockets.on('connection', function (socket) {
    console.log("Having connected devices !");
    socket.on('client-send-message', function (data) {
        console.log("Client has send message : " + data);
    });

});

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/ChatSocket';

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    validUser(db, function () {
        db.close();
    });

    // insertDocument(db, function () {
    //     db.close();
    // });
});

var insertDocument = function (db, callback) {
    db.collection('Users').insertOne({
        "user_name": "hanv",
        "email": "hanv@gmail.com"
    }, function (err, result) {
        assert.equal(err, null);
        // console.log("Inserted a document into the Users collection.");
        callback();
    });
};

var validUser = function (db, data, callback) {
    db.collection('Users').findOne({
        "user_name": data.user_name,
        "password": data.password
    }, function (err, doc) {
        if (doc) {
            console.log("This user already exists");
            console.log(doc);
        } else {
            console.log("This user does not exist yet");
        }
    });

};