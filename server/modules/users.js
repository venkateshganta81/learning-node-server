"use strict";
var Users = function () {
};
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var _ = require('underscore');
var fsExtra = require('fs-extra');
var fs = require('fs');
var sendGridConfig = require('../config/config').sendGrid;
var SendGrid = require('sendgrid-nodejs').SendGrid;
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendGridConfig.apiKey);
var generatePassword = require('generate-password');
var UsersColl = require('../models/schemas').UsersColl;


var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');

var config = require('../config/config');




Users.prototype.signIn = function (body, callback) {
    var retObj = {};
    if (!(body.email && /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(body.email))) {
        retObj.status = false;
        retObj.message = 'Invalid email';
        callback(retObj);
    } else if (!body.password) {
        retObj.status = false;
        retObj.message = 'Please enter password';
        callback(retObj);
    } else {
        UsersColl.findOne({ email: body.email }, function (err, data) {
            if (err) {
                console.log('err', err);
                retObj.status = false;
                retObj.message = 'Please try again';
                callback(retObj);
            } else if (data) {
                /* data.password = CryptoJS.SHA3(data.password).toString(); */
                if (data.password === body.password) {
                    jwt.sign({
                        id: data._id,
                        userType: data.userType,
                        phone: data.phone,
                        name: data.name,
                        activeStatus: data.activeStatus
                    }, config.jwt.secret, function (err, token) {
                        if (err) {
                            retObj.status = false;
                            retObj.message = "Error, please try again";
                            callback(retObj);
                        } else {
                            retObj.status = true;
                            retObj.message = 'Successful login';
                            retObj.token = token;
                            retObj.userType = data.userType;
                            retObj.phone = data.phone;
                            retObj.name = data.name;
                            retObj.id = data._id;
                            callback(retObj);
                        }
                    });
                } else {
                    retObj.status = false;
                    retObj.message = 'Invalid credentials';
                    callback(retObj);
                }
            } else {
                retObj.status = false;
                retObj.message = 'Invalid credentials';
                callback(retObj);
            }
        })

    }
};


/* Users.prototype.changePassword = function (id, body, callback) {
    var retObj = {};
    if (!id || !ObjectId.isValid(id)) {
        retObj.status = false;
        retObj.message = "Authentication failed !";
        callback(retObj);
    } else if (!body.oldPwd) {
        retObj.status = false;
        retObj.message = "Please enter old password";
        callback(retObj);
    } else if (!body.newPwd) {
        retObj.status = false;
        retObj.message = "Please enter new password";
        callback(retObj);
    } else {
        UsersColl.findOne({_id: id}, function (err, user) {
            if (err) {
                retObj.status = false;
                retObj.message = "please try again";
                callback(retObj);
            } else if (user) {
                if (user.password === body.oldPwd) {

                    var condition = {_id: id};
                    var update = {
                        password: body.newPwd
                    };
                    UsersColl.findOneAndUpdate(condition, update, function (err, data) {
                        if (err) {
                            retObj.status = false;
                            retObj.message = "please try again";
                            callback(retObj);
                        } else if (data) {
                            retObj.status = true;
                            retObj.message = "Password changed successfully";
                            callback(retObj);
                        } else {
                            retObj.status = false;
                            retObj.message = "Please try again";
                            callback(retObj);
                        }
                    });
                } else {
                    retObj.status = false;
                    retObj.message = "Old password wrong";
                    callback(retObj);
                }
            } else {
                retObj.status = false;
                retObj.message = "Authentication failed 2";
                callback(retObj);

            }
        });


    }
}; */



Users.prototype.getUserDetails = function (id, callback) {
    var retObj = {};
    UsersColl.findOne({ _id: id }, { password: 0, updatedAt: 0, createdAt: 0, registeredDate: 0 }, function (err, res) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error While Retreiving Data";
            callback(retObj);
        } else if (res) {
            retObj.status = true;
            retObj.message = "Details were found";
            retObj.data = res;
            callback(retObj);
        } else {
            retObj.status = false;
            retObj.message = "No Data was found";
            callback(retObj);
        }
    });
};



module.exports = new Users();
