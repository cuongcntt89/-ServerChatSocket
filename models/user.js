var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_name: String,
    password: String,
    admin: Boolean
});

module.exports = mongoose.model('Users', UserSchema);