"use strict";
var Inventory = function() {};
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var _ = require("underscore");
var fs = require("fs");
var InventoryColl = require("../models/schemas").InventoryColl;

var config = require("../config/config");

Inventory.prototype.getInventory = function (callback) {
    var retObj = {};
    InventoryD3Coll.find({}).lean().exec(function (err, res) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error While Getting Inventory";
            callback(retObj);
        } else if (res) {
            retObj.status = true;
            retObj.message = "Inventory Found";
            retObj.data = res;
            callback(retObj);
        } else {
            retObj.status = false;
            retObj.message = "No Data was found";
            callback(retObj);
        }
    })
}

module.exports = new Inventory();
