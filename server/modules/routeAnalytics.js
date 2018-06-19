"use strict";
var routeAnalytics = function() {};
var mongoose = require("mongoose");
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;
var _ = require("underscore");
var fs = require("fs");
var InventoryColl = require("../models/schemas").InventoryColl;
var operatorAggregation = require("../models/schemas").operatorAggregation;

var routeWiseSalesTotal = require("../models/schemas").routeWiseSalesTotal;
var operatorSalesTotalByRoute = require("../models/schemas").operatorSalesTotalByRoute;
var operatorSalesTotalByRouteByDate = require("../models/schemas").operatorSalesTotalByRouteByDate;

var config = require("../config/config");


routeAnalytics.prototype.routeWiseSalesTotal = function (callback) {
    var retObj = {};
    routeWiseSalesTotal.find({}).exec(
        function (err, routeTotals) {
            if (err) {
                retObj.status = false;
                retObj.message = "Error While Getting Routewise totals";
                callback(retObj);
            } else if (routeTotals) {
                retObj.status = true;
                retObj.message = "Transactions Found";
                retObj.data = routeTotals;
                callback(retObj);
            } else {
                retObj.status = false;
                retObj.message = "No Data was found";
                callback(retObj);
            }
        })
}

routeAnalytics.prototype.operatorSalesTotalByRoute = function (source,destination, callback) {
    var retObj = {};
    operatorSalesTotalByRoute.find({"_id.Source":source, "_id.Destination":destination}).exec(
        function (err, operatorsTotalsForRoute) {
            if (err) {
                retObj.status = false;
                retObj.message = "Error While Getting Routewise totals";
                callback(retObj);
            } else if (operatorsTotalsForRoute) {
                retObj.status = true;
                retObj.message = "Transactions Found";
                retObj.data = operatorsTotalsForRoute;
                callback(retObj);
            } else {
                retObj.status = false;
                retObj.message = "No Data was found";
                callback(retObj);
            }
        })
}

routeAnalytics.prototype.operatorSalesTotalByRouteByDate = function (source,destination,operatorName, callback) {
    var retObj = {};
    operatorSalesTotalByRoute.find({"_id.Source":source, "_id.Destination":destination,"_id.OperatorName":operatorName}).exec(
        function (err, operatorTotalByRoute) {
            if (err) {
                retObj.status = false;
                retObj.message = "Error While Getting Routewise totals";
                callback(retObj);
            } else if (operatorTotalByRoute) {
                retObj.status = true;
                retObj.message = "Transactions Found";
                retObj.data = operatorTotalByRoute;
                callback(retObj);
            } else {
                retObj.status = false;
                retObj.message = "No Data was found";
                callback(retObj);
            }
        })
}

module.exports = new routeAnalytics();
