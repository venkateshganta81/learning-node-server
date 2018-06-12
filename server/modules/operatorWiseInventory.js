"use strict";
var operatorWiseInventory = function() {};
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var _ = require("underscore");
var fs = require("fs");
var InventoryColl = require("../models/schemas").InventoryColl;

var config = require("../config/config");

operatorWiseInventory.prototype.getOperatorWiseInventory = function (callback) {
    var retObj = {};
    async.parallel({
        operators: function (operatorsCallback) {
            InventoryColl.distinct("OperatorName").exec(function (err, operators) {
                operatorsCallback(err, operators);
            })
        },
        aggregatedData: function(error, agCallback){
            agCallback();
        }

    }, function(error, results){
        console.log(results);
    });
    /*
    InventoryColl.aggregate([{
        $group: {
            _id: { OperatorName: "$OperatorName", BookedDate: "$BookedDate" },
            count: { $sum: 1 },
            TicketAmount: { $sum: "$TicketAmount" }
          }
    }],function (err, operatorWiseInventory) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error While Getting Inventory";
            callback(retObj);
        } else if (operatorWiseInventory) {
            console.log('operatorWiseInventory',operatorWiseInventory)
            retObj.status = true;
            retObj.message = "Inventory Found";
            retObj.data = operatorWiseInventory;
            callback(retObj);
        } else {
            retObj.status = false;
            retObj.message = "No Data was found";
            callback(retObj);
        }
    })*/
}

module.exports = new operatorWiseInventory();
