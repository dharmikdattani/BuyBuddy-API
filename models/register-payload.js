const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registerSchema = new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Firstname: String,
    Lastname: String,
    email: String,
    password:String,
    Address: String,
    accessToken:String,    
    refreshToken:String

});

module.exports = mongoose.model('register', registerSchema);