var mongoose = require('mongoose');
var mObjectId = mongoose.Schema.ObjectId;
var ObjectId = require('mongoose').Types.ObjectId;
var jwt = require('jsonwebtoken');
var fs = require('fs');
var utils = require('../common/utils');
var config = require('../config/config');
var subAdminCollection = require('../models/user').userModel;
var SubAdmin = function () { };

SubAdmin.prototype.addSubAdmin = function (SubAdmin, callback) {
    var retObj = {};
    if (!SubAdmin.name) {
        retObj.status = false;
        retObj.message = "Please Provide Name";
        callback(retObj);
    } else if (!SubAdmin.email) {
        retObj.status = false;
        retObj.message = "Please Provide email";
        callback(retObj);
    } else if (!utils.isValidEmail(SubAdmin.email)) {
        retObj.status = false;
        retObj.message = "Please Provide Valid email";
        callback(retObj);
    } else if (!SubAdmin.mobile) {
        retObj.status = false;
        retObj.message = "Please Provide Mobile";
        callback(retObj);
    } else {
        SubAdmin.role = 'Sub Admin';
        SubAdmin.status = SubAdmin.status == "Active" ? true : false;
        (new subAdminCollection(SubAdmin).save(function (err, savedSubAdmin) {
            if (err) {
                retObj.status = false;
                retObj.message = "Error while saving the details";
                callback(retObj);
            } else {
                retObj.status = true;
                retObj.message = "SubAdmin saved successfully";
                retObj.SubAdmin = savedSubAdmin;
                callback(retObj);
            }
        }))
    }
};


SubAdmin.prototype.getAllSubAdmins = function (id, callback) {
    var retObj = {};
    if (!id) {
        retObj.status = false;
        retObj.message = "User not logged in";
        callback(retObj);
    }else{
        subAdminCollection.find({},function(err,SubAdmins){
            if(err){
                retObj.status = false;
                retObj.message = "Error while fetching SubAdmins";
                callback(retObj);
            }else{
                retObj.status = true;
                retObj.message = "successfully fetched SubAdmins";
                retObj.SubAdmins = SubAdmins;
                callback(retObj);
            }
        })
     }
}

SubAdmin.prototype.getSubAdminDetails = function(id,callback){
    var retObj ={};
    subAdminCollection.findOne({_id:id},function(err,subAdmin){
        if (err) {
            retObj.status = false;
            retObj.message = "Error while searching profile";
            callback(retObj);
        } else {
            retObj.status = true;
            retObj.message = "Successfully fetched Profile";
            retObj.SubAdmin = subAdmin;
            callback(retObj);
        }
    })
}

SubAdmin.prototype.updateSubAdmin = function (id, profilesDetails, callback) {
    var retObj = {};
    subAdminCollection.findOneAndUpdate({ _id: id }, {
        $set: {
            name: profilesDetails.name,
            email: profilesDetails.email,
            phone: profilesDetails.phone,
            status: profilesDetails.status,
        }
    }, function (err, subAdmin) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error while updating profile,please try again";
            callback(retObj);
        } else {
            retObj.status = true;
            retObj.message = "Successfully updated Profile";
            retObj.SubAdmin = subAdmin;
            callback(retObj);
        }
    })
}

module.exports = new SubAdmin();