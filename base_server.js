var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var app = express();
var Users = require('./models/user');

var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var fs = require("fs");

var port = process.env.PORT || 8080;
var router = express.Router();
mongoose.connect('mongodb://localhost:27017/ChatSocket');
var connect = mongoose.connection;
var ObjectID = require('mongodb').ObjectID;

server.listen(process.env.PORT || 3000);

app.set('superSecret', 'token_chat_socket');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(morgan('dev'));

io.sockets.on('connection', function (socket) {

    socket.on('client-send-message', function (data) {
        var log = {
            content: data,
            _id: ObjectID
        };
        connect.collection('logs').insert(log);
        socket.emit('result', {content : data});
    });
});

var insertDocument = function (db, callback) {
    db.collection('logs').insertOne({
        "user_name": "hanv",
        "email": "hanv@gmail.com"
    }, function (err, result) {
        assert.equal(err, null);
        callback();
    });
};

// router.use(function (req, res, next) {
//     console.log('Just received a request');
//     next();
// });

// router.get('/', function (req, res) {
//     res.json({
//         message: 'hooray! welcome to our api!'
//     });
// });

router.route('/users')
    .post(function (req, res) {
        Users.findOne({
            user_name: req.body.user_name,
            password: req.body.password
        }, function (err, user) {
            if (err) {
                res.send(err); // Error when requesting
            } else {
                if (user) { // Login success
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 60 * 60 * 24 // Expires in 24 hours
                    });
                    res.send({
                        code: 0, // Success
                        token: token
                    });
                } else { // Login failed
                    res.send({
                        code: 1
                    });
                }
            }
        });
    });

router.route('/users/:user_id')
    .get(function (req, res) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    Users.findById(req.params.user_id, function (err, users) {
                        if (err) {
                            res.send(err);
                        }
                        res.json(users);
                    });
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });

app.use('/api', router);

app.listen(port);