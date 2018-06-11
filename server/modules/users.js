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

Users.prototype.signUp = function (body, callback) {
    var retObj = {};
    if (!body.name || (body.name.length < 4) || (body.name.length > 40)) {
        retObj.status = false;
        retObj.message = 'Please enter valid name';
        callback(retObj);
    } else if (!body.phone || !_.isNumber(body.phone) || body.phone.toString().length !== 10) {
        retObj.status = false;
        retObj.message = 'Invalid Phone';
        callback(retObj);
    } else if (!body.email || !/^[a-zA-Z]\S+\@\S+\.\S+/.test(body.email)) {
        retObj.status = false;
        retObj.message = 'Invalid Email';
        callback(retObj);
    } else {
        UsersColl.findOne({ email: body.email }, function (err, user) {
            if (err) {
                retObj.status = false;
                retObj.message = 'Error while querying';
                callback(retObj);
            } else if (user) {
                retObj.status = false;
                retObj.message = 'Email already exists';
                callback(retObj);
            } else {
                body.registeredDate = new Date() - 0;
                var password = generatePassword.generate({
                    length: 8,
                    numbers: true
                });
                body.password = password;
                var doc = new UsersColl(body);
                doc.save(function (err, response) {
                    if (err) {
                        retObj.status = false;
                        retObj.message = 'Please try again';
                        callback(retObj);
                    } else {
                        const msg = {
                            to: body.email,
                            from: '"Hats-AI"<' + sendGridConfig.senderEmail + '>',
                            subject: 'Password for login Hats AI',
                            html: "Hi " + body.name + "," +
                                "</br></br><div style='width: 90%;margin: 0 auto;'>Your Email and Password for loging into Hats AI" +
                                "</br></br><table border='1' >" +
                                "                        <tr>" +
                                "                            <td>Email</td>" +
                                "                            <td>" + body.email + "</td>" +
                                "                        </tr>" +
                                "                        <tr>" +
                                "                            <td>Password</td>" +
                                "                            <td>" + password + "</td>" +
                                "                        </tr>" +
                                "                    </table></div>"

                        };
                        sgMail.send(msg, function (err, success) {
                            if (err) {
                                console.log('err', err);
                                retObj.status = false;
                                retObj.message = "Please try again1";
                                callback(retObj);
                            } else {
                                retObj.status = true;
                                retObj.message = "Email has been sent!";
                                callback(retObj);
                            }
                        });
                    }
                });

            }

        });
    }

};


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


Users.prototype.addClient = function (clientDetails, files, callback) {
    clientDetails.file = [];
    clientDetails.tags = [];
    //console.log("--->",files)
    var retObj = {};
    if (!clientDetails) {
        retObj.status = false;
        retObj.message = "Please Add All Details",
            callback(retObj);
    } else {
        var tags = [];
        for (var i = 0; i < clientDetails.tags.length; i++) {
            tags.push(JSON.parse(clientDetails.tags[i]).text);
        }
        clientDetails.tags=(tags);
        for (var i = 0; i < files.length; i++) {
            console.log("<--->", files[i])
            fsExtra.copy(files[i].path, './client/components/files/' + clientDetails.name + "/" + clientDetails.analysisName + "/" + files[i].originalFilename, function (err) {
                if (err) {
                    retObj.status = false;
                    retObj.message = "Error While uploading File",
                        callback(retObj);
                }
            });
            clientDetails.file.push(files[i].originalFilename)

        }
        console.log(clientDetails.file);
        var doc = new UsersColl(clientDetails);
        doc.save(function (err, res) {
            if (err) {
                retObj.status = false;
                retObj.message = 'Please try again';
                callback(retObj);
            } else {
                UsersColl.findOneAndUpdate({ _id: res._id }, { $push: { 'files': clientDetails.file } }, { new: true }, function (error, data) {
                    if (error) {
                        retObj.status = false;
                        retObj.message = 'Error while Updating Details';
                        callback(retObj);
                    } else if (data) {
                        retObj.status = true;
                        retObj.message = 'Client Details Added Successfully';
                        retObj.data = data;
                        callback(retObj);
                    } else {
                        retObj.status = false;
                        retObj.message = 'No Data Found';
                        callback(retObj);
                    }
                });
            }
        });
    }
};



/* Users.prototype.addMoreFiles = function (clientDetails, files, callback) {
    var retObj = {}, moreFiles = [];
    if (!clientDetails) {
        retObj.status = false;
        retObj.message = "Please Add All Details",
            callback(retObj);
    } else {
        for (var i = 0; i < files.length; i++) {
            
            fsExtra.copy(files[i].path, './client/components/files/' + clientDetails.name + "/" + clientDetails.analysisName + '/' + files[i].originalFilename, function (err) {
                if (err) {
                    retObj.status = false;
                    retObj.message = "Error While uploading File",
                        callback(retObj);
                }
            });
            moreFiles.push(files[i].originalFilename)

        }
        UsersColl.findById({_id:clientDetails.id},function(err,data){
            if(err){
                retObj.status = false;
                retObj.message = "Error Finding the user";
                callback(retObj);
            }else{
                for(i=0;i<data.analysisName.length;i++){
                    if(data.analysisName[i] === clientDetails.analysisName){
                        UsersColl.findOneAndUpdate({_id:clientDetails.id}, { $push: { "files.i": { $each: moreFiles } } }, { new: true }, function (error, data) {
                            if (error) {
                                console.log(error)
                                retObj.status = false;
                                retObj.message = 'Error while Updating Details';
                                callback(retObj);
                            } else if (data) {
                                retObj.status = true;
                                retObj.message = 'Client Details Added Successfully';
                                retObj.data = data;
                                callback(retObj);
                            } else {
                                retObj.status = false;
                                retObj.message = 'No Data Found';
                                callback(retObj);
                            }
                        });
                    }
                }
            }
        })
               


    }
}; */


Users.prototype.addMoreAnalysis = function (clientDetails, files, callback) {
    console.log("Tags---->",files.length)
    files=_.values(files);
    var retObj = {}, moreFiles = [];
    if (!clientDetails) {
        retObj.status = false;
        retObj.message = "Please Add All Details",
            callback(retObj);
    } else {
        var tags = [];
        for (var i = 0; i < clientDetails.tags.length; i++) {
            tags.push(JSON.parse(clientDetails.tags[i]).text);
        }
        clientDetails.tags = (tags);
        for (var i = 0; i < files.length; i++) {
            moreFiles.push(files[i].originalFilename)
            console.log(moreFiles)
            fsExtra.copy(files[i].path, './client/components/files/' + clientDetails.name + "/" + clientDetails.analysisName + '/' + files[i].originalFilename, function (err) {
                if (err) {
                    retObj.status = false;
                    retObj.message = "Error While uploading File",
                    callback(retObj);
                }
            });
        }
        console.log("filess",moreFiles)
        UsersColl.findOne({ _id: clientDetails.id }, function (error, data) {
            //console.log(error, data)
            if (error) {
                retObj.status = false;
                retObj.message = 'Error while Updating Details';
                callback(retObj);
            } else {
                //console.log(data);
                data = data;
                data.files.push(moreFiles);
                data.analysisName.push(clientDetails.analysisName);
                data.tags.push(clientDetails.tags);
                data.save(function (err, user) {
                    if (err)
                        return res.send(err);
                    else {
                        retObj.status = true;
                        retObj.message = 'User Details updated Successfully';
                        retObj.data = user;
                     //   console.log(user);
                        callback(retObj);
                    }
                });
            }
        });


    }


};


Users.prototype.addCustomizedFile = function (client, file, callback) {
    var retObj = {};
    fsExtra.copy(file.path, './client/components/files/' + client.name + "/" + file.originalFilename, function (err) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error While uploading File",
                callback(retObj);
        }
    });
    UsersColl.findOneAndUpdate({ _id: client.id }, { $set: { 'customFrrole': file.originalFilename } }, { new: true }, function (error, data) {
        if (error) {
            retObj.status = false;
            retObj.message = 'Error while Updating Details';
            callback(retObj);
        } else if (data) {
            retObj.status = true;
            retObj.message = 'File Added Successfully';
            retObj.data = data;
            callback(retObj);
        } else {
            retObj.status = false;
            retObj.message = 'No Data Found';
            callback(retObj);
        }
    });
};


Users.prototype.saveMouseMovement = function (id, clientName, data, clicks, image, callback) {
    var retObj = {};
    var name = id + new Date().getTime();
    fs.writeFile('./client/components/files/' + clientName + '/' + name + '.png', image, 'base64', function (err) {
        if (err) {
            retObj.status = false;
            retObj.message = "Failed uploading";
            callback(retObj);
        } else {
            UsersColl.findOneAndUpdate({ _id: id }, { $set: { "mouseMovent": data, 'mouseClicks': clicks, "sites": name } }, { new: true }, function (err, res) {
                if (err) {
                    retObj.status = false;
                    retObj.message = "Error While Getting Details";
                    callback(retObj);
                } else if (res) {
                    retObj.status = true;
                    retObj.message = "Saved Mouse Movement and Screenshot";
                    retObj.data = res;
                    callback(retObj);
                } else {
                    retObj.status = false;
                    retObj.message = "No Data was found";
                    callback(retObj);
                }
            })
        }
    });
}





Users.prototype.getClientDetails = function (callback) {
    var retObj = {};
    UsersColl.find({ 'userType': 'user' }, function (err, res) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error While Getting Client Details";
            callback(retObj);
        } else if (res) {
            retObj.status = true;
            retObj.message = "Clients Data Found";
            retObj.data = res;
            callback(retObj);
        } else {
            retObj.status = false;
            retObj.message = "No Data was found";
            callback(retObj);
        }
    })
}

Users.prototype.giveAccess = function (details, expiryDate, callback) {
    var retObj = {},
        password = generatePassword.generate({
            length: 8,
            numbers: true
        }),
        registeredDate = new Date();
    UsersColl.findOneAndUpdate({ _id: details._id }, { $set: { 'registeredDate': registeredDate, 'expiryDate': expiryDate, 'password': password } }, { new: true }, function (err, res) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error While Updating Client Details";
            callback(retObj);
        } else if (res) {
            var encryptedPassword = CryptoJS.SHA3(password).toString();
            const msg = {
                to: details.email,
                from: '"Hats-AI"<' + sendGridConfig.senderEmail + '>',
                subject: 'Password for login Hats AI',
                html: "Hi " + details.name + "," +
                    "</br></br><div style='width: 90%;margin: 0 auto;'>Your Email and Password for loging into Hats AI" +
                    "</br></br><table border='1' >" +
                    "                        <tr>" +
                    "                            <td>Email</td>" +
                    "                            <td>" + details.email + "</td>" +
                    "                        </tr>" +
                    "                        <tr>" +
                    "                            <td>Password</td>" +
                    "                            <td>" + password + "</td>" +
                    "                        </tr>" +
                    "</table></div>"

            };
            sgMail.send(msg, function (err, success) {
                if (err) {
                    retObj.status = false;
                    retObj.message = "Please try again";
                    callback(retObj);
                } else {
                    retObj.status = true;
                    retObj.message = "Email has been sent!";
                    callback(retObj);
                }
            });
        } else {
            retObj.status = false;
            retObj.message = "No Data was found";
            callback(retObj);
        }
    });
}

Users.prototype.addAnalysis = function (id, data, callback) {
    var retObj = {};
    console.log(data);
    UsersColl.findOneAndUpdate({ _id: id }, { $push: { 'analysis': data } }, { new: true }, function (err, result) {
        if (err) {
            retObj.status = false;
            retObj.message = "Please try again";
            callback(retObj);
        } else if (result) {
            retObj.status = true;
            retObj.message = "Successfully Updated Analysis Data";
            retObj.data = result;
            callback(retObj);
        } else {
            retObj.status = false;
            retObj.message = "User Details Not Found";
            callback(retObj);
        }
    });
}


Users.prototype.saveFrroleData = function (id, data,index, callback) {
    var retObj = {};
    UsersColl.findOneAndUpdate({ _id: id }, { $push: { 'frrole': {'analysis':index , "data":data} } }, { new: true }, function (err, result) {
        if (err) {
            retObj.status = false;
            retObj.message = "Please try again";
            callback(retObj);
        } else if (result) {
            retObj.status = true;
            retObj.message = "Successfully Added Frrole Data";
            retObj.data = result;
            callback(retObj);
        } else {
            retObj.status = false;
            retObj.message = "User Details Not Found";
            callback(retObj);
        }
    });
}



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