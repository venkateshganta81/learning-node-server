var mongoose = require('mongoose');
var mObjectId = mongoose.Schema.ObjectId;
var ObjectId = require('mongoose').Types.ObjectId;
var jwt = require('jsonwebtoken');
var fs = require('fs');
var utils = require('../common/utils');
var config = require('../config/config');
var userCollection = require('../models/user').userModel;
var userSocialCollection = require('../models/user').userSocialModel;
var createdUserCollection = require('../models/user').createdUserCollection;
var userColl = require('../models/user').userDetailsCollection;
var employeeCollection = require('../models/user').employeeCollection;
var User = function () { };

User.prototype.signUp = function (body, callback) {
    var retObj = {};
    if (!body.name) {
        retObj.status = false;
        retObj.message = 'Please provide name';
        callback(retObj);
    } else if (!utils.isValidEmail(body.email)) {
        retObj.status = false;
        retObj.message = 'Please provide valid email-id';
        callback(retObj);
    } else if (!utils.isValidPhoneNumber(body.phone)) {
        retObj.status = false;
        retObj.message = 'Please provide valid phone number';
        callback(retObj);
    } else if (!body.password || body.password.length < 8) {
        retObj.status = false;
        retObj.message = 'Password should contain minimum 8 characters';
        callback(retObj);
    } else {
        /* var mobileOtp = utils.generateOTP(); */
        userCollection.findOne({ email: body.email }, function (err, userData) {
            if (err) {
                retObj.status = false;
                retObj.message = 'Sorry, Could not process your request';
                callback(retObj);
            } else if (userData) {
                retObj.status = false;
                console.log(userData);
                retObj.message = 'User already exists';
                callback(retObj);
            } else {
                /* body.mobileOtp = mobileOtp; */
                (new userCollection(body).save(function (err, user) {
                    if (err) {
                        retObj.status = false;
                        retObj.message = 'Could not save user details';
                        callback(retObj);
                    } else {
                        retObj.status = true;
                        retObj.message = "Signup successfull";
                        retObj.user = user;
                        callback(retObj);
                    }
                }));
            }
        });
    }
};



User.prototype.login = function (body, callback) {
    var retObj = {};
    if (!utils.isValidEmail(body.email)) {
        retObj.status = false;
        retObj.message = 'Please provide valid email-id';
        callback(retObj);
    } else if (!body.password) {
        retObj.status = false;
        retObj.message = 'Please provide password';
        callback(retObj);
    } else {
        userCollection.findOne({ email: body.email }, function (err, userData) {
            if (err) {
                retObj.status = false;
                retObj.message = 'Sorry, Could not process your request';
                callback(retObj);
            } else if (!userData) {
                retObj.status = false;
                retObj.message = 'Could not find any account';
                callback(retObj);
            }else if (userData.password.toString() === body.password.toString()) {
                jwt.sign({
                    id: userData._id, firstName: userData.firstName, lastName: userData.lastName, email: userData.email
                }, config.jwt.secret, config.jwt.options, function (err, token) {
                    if (err) {
                        retObj.status = false;
                        retObj.message = 'Sorry, Could not process your request';
                        retObj.user = userData;
                        callback(retObj);
                    } else {
                        retObj.status = true;
                        retObj.message = 'Login successful';
                        retObj.userToken = token;
                        retObj.user = userData;
                        delete userData.password;
                        callback(retObj);
                    }
                });
            } else {
                retObj.status = false;
                retObj.message = 'Invalid Credentials';
                callback(retObj);
            }
        });
    }
};



User.prototype.addExperience = function(id, details,callback){
    var retObj = {};
    userCollection.findOneAndUpdate({_id:id},{$push:{"experience":details}},{new:true},function(err,data){
        if (err) {
            retObj.status = false;
            retObj.message = 'Error while updating experience';
            callback(retObj);
        } else {
            retObj.status = true;
            retObj.message = 'Successfully added Experience';
            retObj.data = data;
            delete userData.password;
            callback(retObj);
        }
    })
}


User.prototype.getExperience = function(id,callback){
    var retObj = {};
    userCollection.findOneAndUpdate({_id:id},function(err,data){
        if (err) {
            retObj.status = false;
            retObj.message = 'Error while fetching experience';
            callback(retObj);
        } else {
            retObj.status = true;
            retObj.message = 'Successfully fetched Experience';
            retObj.data = data;
            delete userData.password;
            callback(retObj);
        }
    })
}


User.prototype.addEmployee = function(details,callback){
    var retObj = {};
    if (!details.name) {
        retObj.status = false;
        retObj.message = 'Please provide name';
        callback(retObj);
    } else if (!utils.isValidEmail(details.email)) {
        retObj.status = false;
        retObj.message = 'Please provide valid email-id';
        callback(retObj);
    } else if (!utils.isValidPhoneNumber(details.mobile)) {
        retObj.status = false;
        retObj.message = 'Please provide valid phone number';
        callback(retObj);
    } else if (!details.designation) {
        retObj.status = false;
        retObj.message = 'please Provide Designation';
        callback(retObj);
    }else if (!details.gender) {
        retObj.status = false;
        retObj.message = 'please Provide Gender';
        callback(retObj);
    }else if (!details.bloodGroup) {
        retObj.status = false;
        retObj.message = 'please Provide Blood Group';
        callback(retObj);
    }/* else if (!details.profilePic) {
        retObj.status = false;
        retObj.message = 'please Provide Blood Group';
        callback(retObj);
    } */ else {
        employeeCollection.findOne({ email: details.email }, function (err, userData) {
            if (err) {
                retObj.status = false;
                retObj.message = 'Sorry, Could not process your request';
                callback(retObj);
            } else if (userData) {
                retObj.status = false;
                console.log(userData);
                retObj.message = 'Employee already exists';
                callback(retObj);
            } else {
                (new employeeCollection(details).save(function (err, employee) {
                    if (err) {
                        retObj.status = false;
                        retObj.message = 'Could not save Employee details';
                        callback(retObj);
                    } else {
                        retObj.status = true;
                        retObj.message = "Successfully created Employee";
                        retObj.employee = employee;
                        callback(retObj);
                    }
                }));
            }
        });
    }
}


User.prototype.getEmployee = function(callback){
    var retObj = {};
    employeeCollection.find({},function(err,employeeDetails){
        if (err) {
            retObj.status = false;
            retObj.message = 'Error while fetching employee details';
            callback(retObj);
        } else {
            retObj.status = true;
            retObj.message = 'Successfully fetched Experience';
            retObj.employeeDetails = employeeDetails;
            callback(retObj);
        }
    })
}



module.exports = new User();

