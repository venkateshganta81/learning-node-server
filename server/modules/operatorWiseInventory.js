"use strict";
var operatorWiseInventory = function() {};
var mongoose = require("mongoose");
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;
var _ = require("underscore");
var fs = require("fs");
var InventoryColl = require("../models/schemas").InventoryColl;
var operatorAggregation = require("../models/schemas").operatorAggregation;

var config = require("../config/config");

operatorWiseInventory.prototype.getOperatorWiseInventory = function (callback) {
    var retObj = {};
    async.parallel({
        operators: function (operatorsCallback) {
            InventoryColl.distinct("OperatorName").exec(function (err, operators) {
                operatorsCallback(err, operators);
            })
        },
        aggregatedData: function(agCallback) {
            operatorAggregation.find({}).exec(function (err, aggregatedData) {
                agCallback(err, aggregatedData);
            });
        }
    }, function(error, results){
        retObj.operators = results.operators;
        retObj.aggregatedData = results.aggregatedData;
        retObj.status = true;
        callback(retObj);
    });
}

module.exports = new operatorWiseInventory();
