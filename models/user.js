var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_name: String
});

module.exports = mongoose.model('Users', UserSchema);