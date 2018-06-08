var express = require('express');
var Router = express.Router();
var multiparty = require('connect-multiparty');
var multipartymiddleware = multiparty();
var Users = require('./../modules/users');
var Common = require('./../modules/common');

Router.get('/getClientDetails',function(req,res){
    Users.getClientDetails(function(result){
        res.json(result);
    });
});

Router.post('/giveAccess',function(req,res){
    Users.giveAccess(req.body.details,req.body.expiryDate,function(result){
        res.json(result);
    });
})

Router.post('/saveFrroleData',function(req,res){
    Users.saveFrroleData(req.body.id,req.body.data,req.body.analysis,function(result){
        res.json(result);
    });
})



module.exports = Router;


