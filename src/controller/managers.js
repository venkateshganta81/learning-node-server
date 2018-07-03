var mongoose = require('mongoose');
var mObjectId = mongoose.Schema.ObjectId;
var ObjectId = require('mongoose').Types.ObjectId;
var jwt = require('jsonwebtoken');
var fs = require('fs');
var utils = require('../common/utils');
var config = require('../config/config');
var MantrasCollection = require('../models/user').mantraModel;
var Mantra = function () { };

Mantra.prototype.AddManagerMantra = function (mantra,files, callback) {
    var retObj = {};
    if (!mantra.userType) {
        retObj.status = false;
        retObj.message = "Please Select Category";
        callback(retObj);
    } else if (!mantra.title) {
        retObj.status = false;
        retObj.message = "Please Enter title";
        callback(retObj);
    } else if (!mantra.description) {
        retObj.status = false;
        retObj.message = "Please add Description";
        callback(retObj);
    } /* else if (!mantra.tags.length) {
        retObj.status = false;
        retObj.message = "Please add atleast one tag";
        callback(retObj);
    } */ else {
       /*  var pdfFileName = new Date() - 0 + '.' + 'pdf';
        var videoFileName = new Date() - 0 + '.' + file.videoFile.split('.')[file.videoFile.split('.').length - 1]; */
        /* fs.writeFile('./dist/assets/uploads/' + pdfFileName, file.pdfFiles, function (err) {
            if (err) {
                retObj.status = false;
                retObj.message = "Please try again";
                callback(retObj);
            }
        });
        fs.writeFile('./dist/assets/uploads' + videoFileName, mantra.videoFile, function (err) {
            if (err) {
                retObj.status = false;
                retObj.message = "Please try again";
                callback(retObj);
            }
        });
        mantra.pdfFiles = []; */
        (new MantrasCollection(mantra).save(function (err, savedMantra) {
            if (err) {
                retObj.status = false;
                retObj.message = "Error while saving the details";
                callback(retObj);
            } else {
                retObj.status = true;
                retObj.message = "Manager mantra saved successfully";
                retObj.mantra = savedMantra;
                callback(retObj);
            }
        }))
    }
};


Mantra.prototype.getAllMantras = function (id, callback) {
    var retObj = {};
    /* if (!id) {
        retObj.status = false;
        retObj.message = "User not logged in";
        callback(retObj);
    }else{ */
        MantrasCollection.find({},function(err,mantras){
            if(err){
                retObj.status = false;
                retObj.message = "Error while fetching mantras";
                callback(retObj);
            }else{
                retObj.status = true;
                retObj.message = "successfully fetched mantras";
                retObj.mantras = mantras;
                callback(retObj);
            }
        })
    // }
}

module.exports = new Mantra();