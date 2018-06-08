"use strict";
var paymentGatewayWiseInventory = function() {};
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var _ = require("underscore");
var fs = require("fs");
var InventoryColl = require("../models/schemas").InventoryColl;

var config = require("../config/config");

paymentGatewayWiseInventory.prototype.getPaymentGateWayWiseInventory = function (callback) {
    var retObj = {};
    InventoryColl.aggregate([{
        $group: {
            _id: { PGType: "$PGType", BookedDate: "$BookedDate" },
            count: { $sum: 1 },
            TicketAmount: { $sum: "$TicketAmount" }
          }
    }],function (err, PaymentGateWayWiseInventory) {
        if (err) {
            retObj.status = false;
            retObj.message = "Error While Getting Inventory";
            callback(retObj);
        } else if (PaymentGateWayWiseInventory) {
            console.log('PaymentGateWayWiseInventory',PaymentGateWayWiseInventory)
            retObj.status = true;
            retObj.message = "Payment Gateway Inventory Found";
            retObj.data = PaymentGateWayWiseInventory;
            callback(retObj);
        } else {
            retObj.status = false;
            retObj.message = "No Data was found";
            callback(retObj);
        }
    })
}

module.exports = new paymentGatewayWiseInventory();
