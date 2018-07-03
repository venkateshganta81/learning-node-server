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

User.prototype.verifyOtp = function (body, callback) {
    var retObj = {};
    if (!body.mobileOtp) {
        retObj.status = false;
        retObj.message = 'Please provide verification code';
        callback(retObj);
    } else {
        userCollection.findOne({
            _id: body.id
        }, function (err, userData) {
            if (err) {
                retObj.status = false;
                retObj.message = 'Error while getting credentials';
                callback(retObj);
            } else if (userData) {
                if (body.mobileOtp === userData.mobileOtp) {
                    userData.isVerified = true;
                    userData.save();
                    retObj.status = true;
                    retObj.message = 'User activated successfully';
                    retObj.userDetails = userData;
                    callback(retObj);
                } else {
                    retObj.status = false;
                    retObj.message = 'Invalid OTP,Please try again';
                    callback(retObj);
                }
            } else {
                retObj.status = false;
                retObj.message = 'Could not find any user';
                callback(retObj);
            }
        });
    }
};

User.prototype.resendOtp = function (body, callback) {
    console.log('id', body.id)
    var retObj = {};
    userCollection.findOne({
        _id: body.id
    }, function (err, userData) {
        console.log('userData', err, userData)
        if (err) {
            retObj.status = false;
            retObj.message = 'Error';
            callback(retObj);
        } else if (userData) {
            var mobileOtp = utils.generateOTP();
            console.log('mobileOtp', mobileOtp)
            userCollection.findOneAndUpdate({ _id: userData._id }, { $set: { mobileOtp: mobileOtp } }, function (err, doc) {
                if (err) {
                    retObj.status = false;
                    retObj.message = 'Error';
                    callback(retObj);
                } else if (doc) {
                    var message = 'Hi, ' + ' \n Welcome to Great Manager Institute \n ' +
                        'your one time password  is ' + mobileOtp;
                    msg91.send(doc.phone, message, function (err, response) {
                        if (err) {
                            retObj.status = false;
                            retObj.message = 'Please try again';
                            callback(retObj);
                        } else {
                            console.log(body.phone)
                            retObj.status = true;
                            retObj.message = "OTP Sent successfully";
                            retObj.user = doc;
                            callback(retObj);
                        }
                    });
                } else {
                    retObj.status = false;
                    retObj.message = 'User Not Found';
                    callback(retObj);
                }
            })

        } else {
            retObj.status = false;
            retObj.message = 'Could not find any user';
            callback(retObj);
        }
    });

};

User.prototype.forgotPassword = function (email, callback) {
    var retObj = {};
    if (!utils.isValidEmail(email)) {
        retObj.status = false;
        retObj.message = 'Please provide valid email-id';
        callback(retObj);
    } else {
        userCollection.findOne({ email: email }, function (err, user) {
            if (err) {
                retObj.status = false;
                retObj.message = "Error while getting details";
                callback(retObj);
            } else {
                if (!user) {
                    retObj.status = false;
                    retObj.message = "User not Found";
                    callback(retObj);
                } else {
                    var emailparams = {
                        templateName: "forgotPassword",
                        subject: "Reset Password Link",
                        to: user.email
                    };
                    sendEmail(user, emailparams, function (emailResponse) {
                        callback(emailResponse);
                    });
                }
            }
        })
    }
}

function sendEmail(userData, data, callback) {
    var retObj = {
        messages: []
    };
    var template = null;
    if (!data.templateName) {
        retObj.status = false;
        retObj.messages.push("Please provide template name");
    }
    if (!data.subject) {
        retObj.status = false;
        retObj.messages.push("Please provide subject name");
    }
    if (!data.to) {
        retObj.status = false;
        retObj.messages.push("Please provide to address");
    }
    if (retObj.messages.length) {
        callback(retObj);
    } else {
        var mailBody =
            '<!DOCTYPE html>' +
            '<html lang="en">' +

            '<head>' +
            '<meta charset="UTF-8">' +
            '<title>MTW LABS</title>' +
            '</head>' +

            '<body>' +
            '<div>' +
            '<table>' +
            '<tr>' +
            '<th style="text-align=left;margin-bottom:20px;">Dear  User</th>' +
            '</tr>' +
            '<tr>' +
            '<td>Click the link below to reset your password' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            "http://35.154.44.105:3000/admin/set-password/" + userData._id
        '</td>' +
            '</tr>' +

            '</table>' +
            '</div>' +
            '</body>' +

            '</html>';
        const msg = {
            to: data.to,
            from: "MTW LABS " + '<' + sendGridConfig.senderEmail + '>',
            subject: data.subject,
            html: mailBody

        };
        sgMail.send(msg, function (err, success) {
            if (err) {
                retObj.status = false;
                retObj.message = "Please try again";
                callback(retObj);
            } else {
                retObj.status = true;
                retObj.message = "Email has been Sent!";
                callback(retObj);
            }
        });

    }
}



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
            } else if (!userData.isVerified) {
                retObj.status = false;
                retObj.message = 'Please Verify Your Mobile Number';
                retObj.userId = userData._id;
                callback(retObj);
            } else if (userData.password.toString() === body.password.toString()) {
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





User.prototype.resetPassword = function (id, passwords, callback) {
    var retObj = {};
    if (!passwords.newPassword || passwords.newPassword.length < 8 || !utils.validatePassword(passwords.newPassword)) {
        retObj.status = false;
        retObj.message = "New Password should be minimum 8 in length and have contain atleast one character, one numeric and one special character";
        callback(retObj);
    } else if (!passwords.confirmPassword || passwords.confirmPassword.length < 8 || !utils.validatePassword(passwords.confirmPassword)) {
        retObj.status = false;
        retObj.message = "Confirm Password should be minimum 8 in length and have contain atleast one character, one numeric and one special character";
        callback(retObj);
    } else if (passwords.newPassword !== passwords.confirmPassword) {
        retObj.status = false;
        retObj.message = "new password and confirm password not matching";
        callback(retObj);
    } else {
        userCollection.findOneAndUpdate({ _id: id }, { $set: { 'password': passwords.newPassword } }, { new: true }, function (err, user) {
            if (err) {
                retObj.status = false;
                retObj.message = "Error while updating password";
                callback(retObj);
            } if (!user) {
                retObj.status = false;
                retObj.message = "User not found";
                callback(retObj);
            } else {
                retObj.status = true;
                retObj.message = "Password updated successfully";
                retObj.user = user;
                callback(retObj);
            }
        })
    }
}


User.prototype.changePassword = function (id, currentPassword, passwords, callback) {
    var retObj = {};
    if (!currentPassword) {
        retObj.status = false;
        retObj.message = "Please enter current password";
        callback(retObj);
    } else if (!passwords.newPassword) {
        retObj.status = false;
        retObj.message = "Please enter new password";
        callback(retObj);
    } else if (!passwords.newPassword || passwords.newPassword.length < 8) {
        retObj.status = false;
        retObj.message = 'Password should contain minimum 8 characters';
        callback(retObj);
    } else if (!utils.validatePassword(passwords.newPassword)) {
        retObj.status = false;
        retObj.message = 'Password should contain atleast one character, one numeric and one special character';
        callback(retObj);
    } else if (!passwords.confirmPassword) {
        retObj.status = false;
        retObj.message = "Please enter confirm password";
        callback(retObj);
    } else if (!passwords.confirmPassword || passwords.confirmPassword.length < 8) {
        retObj.status = false;
        retObj.message = 'Password should contain minimum 8 characters';
        callback(retObj);
    } else if (!utils.validatePassword(passwords.confirmPassword)) {
        retObj.status = false;
        retObj.message = 'Password should contain atleast one character, one numeric and one special character';
        callback(retObj);
    } else if (passwords.newPassword !== passwords.confirmPassword) {
        retObj.status = false;
        retObj.message = "new password and confirm password not matching";
        callback(retObj);
    } else {
        userCollection.findOne({ _id: id }, function (err, user) {
            if (err) {
                retObj.status = false;
                retObj.message = "Error while updating password";
                callback(retObj);
            } if (!user) {
                retObj.status = false;
                retObj.message = "User not found";
                callback(retObj);
            } else {

                if (user.password.toString() == currentPassword.toString()) {
                    userCollection.findOneAndUpdate({ _id: id }, { $set: { 'password': passwords.newPassword } }, { new: true }, function (err, user) {
                        if (err) {
                            retObj.status = false;
                            retObj.message = "Error while updating password";
                            callback(retObj);
                        } if (!user) {
                            retObj.status = false;
                            retObj.message = "User not found";
                            callback(retObj);
                        } else {
                            retObj.status = true;
                            retObj.message = "Password updated successfully";
                            retObj.user = user;
                            callback(retObj);
                        }
                    })
                }
            }
        })
    }
}

User.prototype.addNewuser = function (user, callback) {
    var retObj = {};
    if (!user.userName) {
        retObj.status = false;
        retObj.message = "Please enter user name";
        callback(retObj);
    } else if (!user.email) {
        retObj.status = false;
        retObj.message = "Please enter email";
        callback(retObj);
    } else if (!user.mobile) {
        retObj.status = false;
        retObj.message = "Please enter mobile number";
        callback(retObj);
    } else if (!user.mentor.mentorId) {
        retObj.status = false;
        retObj.message = "Please select mentor";
        callback(retObj);
    } else if (!user.mentor.name) {
        retObj.status = false;
        retObj.message = "Please select mentor";
        callback(retObj);
    } else if (!user.status) {
        retObj.status = false;
        retObj.message = "Please select status of user";
        callback(retObj);
    } else {
        (new createdUserCollection(user).save(function (err, userData) {
            console.log("Error", err, userData)
            if (err) {
                retObj.status = false;
                retObj.message = "Error while creating user";
                callback(retObj);
            } else {
                retObj.status = true;
                retObj.message = "User Created Successfully";
                retObj.user = userData;
                callback(retObj);
            }
        }));
    }
}

User.prototype.getAllUsers = function (id, callback) {
    var retObj = {};
    if (!id) {
        retObj.status = false;
        retObj.message = "User not logged in";
        callback(retObj);
    } else {
        createdUserCollection.find({}, function (err, users) {
            if (err) {
                retObj.status = false;
                retObj.message = "Error while fetching users";
                callback(retObj);
            } else {
                retObj.status = true;
                retObj.message = "successfully fetched users";
                retObj.users = users;
                callback(retObj);
            }
        })
    }
}



User.prototype.editProfile = function (id, profileDetails, callback) {
    var retObj = {};
    userCollection.findOneAndUpdate({ _id: id }, { $set: { about: profileDetails } }, function (err, result) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error while updating profile,please try again";
            callback(retObj);
        } else {
            retObj.status = true;
            retObj.message = "Successfully updated Profile";
            retObj.user = result;
            delete retObj.user.password;
            callback(retObj);
        }
    })
}



User.prototype.getProfile = function (id, callback) {
    var retObj = {};
    userCollection.findOne({ _id: id }, function (err, data) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error while searching profile";
            callback(retObj);
        } else {
            retObj.status = true;
            retObj.message = "Successfully fetched Profile";
            retObj.user = data;
            callback(retObj);
        }
    })
}

User.prototype.userEditProfile = function (id, profilesDetails, callback) {
    var retObj = {};
    console.log(id)
    userCollection.findOneAndUpdate({ _id: id }, {
        $set: {
            userName: profilesDetails.userName,
            alternateEmail: profilesDetails.alternateEmail,
            phone: profilesDetails.phone,
            companyName: profilesDetails.companyName,
            show: profilesDetails.show
        }
    }, function (err, result) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error while updating profile,please try again";
            callback(retObj);
        } else {
            retObj.status = true;
            retObj.message = "Successfully updated Profile";
            retObj.user = result;
            callback(retObj);
        }
    })
}


User.prototype.updateManagerSurvey = function (id, callback) {
    console.log('idfhfdjd', id);
    var retObj = {};
    userCollection.findOneAndUpdate({ _id: id }, { $set: { survey: true } }, function (err, data) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error while submitting";
            callback(retObj);
        } else if (data) {
            retObj.status = true;
            retObj.message = "Successfully Updated survey";
            retObj.user = data;
            callback(retObj);
        } else {
            retObj.status = false;
            retObj.message = "Error while updating";
            callback(retObj);
        }
    })
}

User.prototype.updateManagerProfileImage = function (body, callback) {
    var retObj = {};
    userCollection.findOneAndUpdate({ _id: body.id }, { $set: { profilePic: body.profilePic } }, function (err, data) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error while submitting";
            callback(retObj);
        } else if (data) {
            retObj.status = true;
            retObj.message = "Successfully Updated profile image";
            retObj.user = data;
            callback(retObj);
        } else {
            retObj.status = false;
            retObj.message = "Error while updating";
            callback(retObj);
        }
    })
}



module.exports = new User();

