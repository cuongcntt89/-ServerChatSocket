var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ChatSocket');
var Users = mongoose.model('Users', {
    user_name: String,
    email: String,
});

var user1 = new Users({
    name: 'modulus admin',
    age: 42,
    roles: ['admin', 'moderator', 'user']
});

var user1 = new User({
    name: 'modulus admin',
    age: 42,
    roles: ['admin', 'moderator', 'user']
});

user1.save(function (err, userObj) {
    if (err) {
        console.log(err);
    } else {
        console.log('saved successfully:', userObj);
    }
});