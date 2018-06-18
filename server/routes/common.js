var express = require("express");
var OpenRouter = express.Router();
var AuthRouter = express.Router();

var multiparty = require("connect-multiparty");
var multipartymiddleware = multiparty();

var _ = require("underscore");

var config = require("./../config/config").hostUrl;
var Users = require("./../modules/users");
var Inventory = require("./../modules/inventory");

var config = require("./../config/config").hostUrl;
var Users = require("./../modules/users");
var Inventory = require("./../modules/inventory");
var operatorWiseInventory = require("./../modules/operatorWiseInventory");
var paymentGatewayWiseInventory = require("./../modules/paymentGatewayWiseInventory");

var InventoryColl = require("./../models/schemas").InventoryColl;

OpenRouter.post("/sign-up", function(req, res) {
  Users.signUp(req.body, function(result) {
    res.json(result);
  });
});
OpenRouter.post("/verify-password", function(req, res) {
  Users.verifyPassword(req.body, function(result) {
    res.json(result);
  });
});
OpenRouter.post("/sign-in", function(req, res) {
  Users.signIn(req.body, function(result) {
    res.json(result);
  });
});
AuthRouter.post("/change-password", function(req, res) {
  Users.changePassword(req.jwt.id, req.body, function(result) {
    res.json(result);
  });
});

AuthRouter.get("/getUserDetails", function(req, res) {
  Users.getUserDetails(req.jwt.id, function(result) {
    res.json(result);
  });
});


OpenRouter.get("/get-config", function(req, res) {
  res.json({ data: config });
});

//Operator Wise
OpenRouter.get("/getOperatorWiseInventory", function(req, res) {
  operatorWiseInventory.getOperatorWiseInventory(function(result) {
    res.json(result);
  });
});

OpenRouter.get("/getOperatorBookings", function(req, res) {
  console.log("OName",req.query.operatorName);
    operatorWiseInventory.getOperatorBookings(req.query.operatorName, function(result) {
        res.json(result);
    });
});

//Payment Gateway Wise
OpenRouter.get("/getPaymentGateWayWiseInventory", function(req, res) {
  paymentGatewayWiseInventory.getPaymentGateWayWiseInventory(function(result) {
    res.json(result);
  });
});

module.exports = {
  AuthRouter: AuthRouter,
  OpenRouter: OpenRouter
};
