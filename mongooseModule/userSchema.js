const mongoose = require('mongoose');
const validator = require('validator');
const { userRules } = require('../Utils/UserRules');
const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'feild must be a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
    },
    role: {
        type: String,
        enum: [userRules.USER, userRules.ADMIN, userRules.MANAGER],
        default: userRules.USER
    },
    avatar: {
        type: String,
        default:'uploads/profile.png'
    }
})


const user = mongoose.model('users', userSchema);

module.exports = user;