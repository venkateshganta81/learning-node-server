var config = require('../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var mObjectId = mongoose.Types.ObjectId;
var Utils = function(){};

Utils.prototype.isValidPhoneNumber = function (number) {
    return _.isNumber(number) && number.toString().length === 10;
};

Utils.prototype.isValidPassword = function (pwd) {
    return _.isString(pwd) && (pwd.length >= config.passwordLength);
};

Utils.prototype.isValidEmail = function (email) {
    return email && /^\S+@\S+\.\S+/.test(email);
};

Utils.prototype.isValidObjectId = function (id) {
    return id && mObjectId.isValid(id);
};

Utils.prototype.generateOTP = function () {
    return Math.floor(100000 + Math.random() * 900000);
};

Utils.prototype.validatePassword = function(password) {
    return password && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(password);
}

module.exports = new Utils();