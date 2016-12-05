var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    'google.id': String,
    'google.token': String,
    'google.name': String,
    'google.email': String,
    type: String,
    name: String,
    image: String,
    email: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
