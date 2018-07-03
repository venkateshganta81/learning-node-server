var express = require('express');
var commonRouter = express.Router();
var AuthRouter = express.Router();
var fs = require('fs-extra');

var SubAdmin = require('../controller/subAdmin');


AuthRouter.post('/addSubAdmin',function(req,res){
    SubAdmin.addSubAdmin(req.body,function(resp){
        res.json(resp);
    })
})

AuthRouter.get('/getAllSubAdmins/:id',function(req,res){
    SubAdmin.getAllSubAdmins(req.params.id,function(resp){
        res.json(resp);
    })
})

AuthRouter.get('/getSubAdminDetails/:id',function(req,res){
    SubAdmin.getSubAdminDetails(req.params.id,function(resp){
        res.json(resp);
    })
})

AuthRouter.put('/updateSubAdmin',function(req,res){
    SubAdmin.updateSubAdmin(req.body.id,req.body.details,function(resp){
        res.json(resp);
    })
})

module.exports = {
    commonRouter: commonRouter,
    AuthRouter: AuthRouter    
}