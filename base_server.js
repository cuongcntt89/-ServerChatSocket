var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost:27017/ChatSocket');

var Users = require('./models/user');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

// router.use(function (req, res, next) {
//     console.log('Something is happening.');
//     next();
// });

// router.get('/', function (req, res) {
//     res.json({
//         message: 'hooray! welcome to our api!'
//     });
// });

// router.route('/users');

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