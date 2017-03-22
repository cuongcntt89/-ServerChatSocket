var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var app = express();
var Users = require('./models/user');

var port = process.env.PORT || 8080;
var router = express.Router();
mongoose.connect('mongodb://localhost:27017/ChatSocket');

app.set('superSecret', 'token_chat_socket');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(morgan('dev'));

// router.use(function (req, res, next) {
//     console.log('Something is happening.');
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
                        expiresIn: 60*60*24 // Expires in 24 hours
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
        Users.findById(req.params.user_id, function (err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });

app.use('/api', router);

app.listen(port);