var express = require('express');
var commonRouter = express.Router();
var AuthRouter = express.Router();
// var multer = require('multer');
var fs = require('fs-extra');
var path = require('path');

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         console.log('2-----------------',file);
//         cb(null, './dist/uploads')
//     },
//     filename: function (req, file, cb) {
//         console.log('3---------------',file);
//         cb(null, Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]) //Appending extension
//     }
// });

// var singleUpload = multer({ storage: storage }).any();

var ManagerMantra = require('../controller/managers');


AuthRouter.post('/add',function(req,res){
    ManagerMantra.AddManagerMantra(req.body,req.files,function(resp){
        res.json(resp);
    })
})

AuthRouter.get('/getAllMantras/:id',function(req,res){
    ManagerMantra.getAllMantras(req.jwt,function(resp){
        res.json(resp);
    })
})


module.exports = {
    commonRouter: commonRouter,
    AuthRouter: AuthRouter    
}