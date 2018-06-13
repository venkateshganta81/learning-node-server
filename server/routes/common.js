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

AuthRouter.post("/addClient", multipartymiddleware, function(req, res) {
  var files = Object.values(req.files.file);
  Users.addClient(req.query, files, function(result) {
    res.json(result);
  });
});

AuthRouter.post("/addCustomizedFile", multipartymiddleware, function(req, res) {
  /*    var files = Object.values(req.files.file); */
  console.log(req.query, req.files.file);
  Users.addCustomizedFile(req.query, req.files.file, function(result) {
    res.json(result);
  });
});

AuthRouter.post("/addMoreFile", multipartymiddleware, function(req, res) {
  /*    var files = Object.values(req.files.file); */
  Users.addMoreFiles(req.query, req.files.file, function(result) {
    res.json(result);
  });
});

AuthRouter.post("/addMoreAnalysis", multipartymiddleware, function(req, res) {
  console.log(req.files.file);
  Users.addMoreAnalysis(req.query, req.files.file, function(result) {
    res.json(result);
  });
});

AuthRouter.post("/saveMouseMovement", function(req, res) {
  //console.log(req.body);
  Users.saveMouseMovement(
    req.body.id,
    req.body.name,
    req.body.mouseMovement,
    req.body.mouseClicks,
    req.body.image,
    function(result) {
      res.json(result);
    }
  );
});

OpenRouter.post("/data", function(req, res) {
  console.log("External Data", req.body);
});

AuthRouter.get("/getUserDetails", function(req, res) {
  Users.getUserDetails(req.jwt.id, function(result) {
    res.json(result);
  });
});
AuthRouter.post("/saveDataIntoJsonFile", function(req, res) {
  Users.saveDataIntoJsonFile(req.jwt.id, req.body, function(result) {
    res.json(result);
  });
});

AuthRouter.post("/addAnalysis", function(req, res) {
  // console.log("-->Data",req.body);
  Users.addAnalysis(req.body.id, req.body.data, function(result) {
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
