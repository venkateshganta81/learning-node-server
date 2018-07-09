var express = require('express');
var commonRouter = express.Router();
var AuthRouter = express.Router();
/* let multiparty = require('connect-multiparty');
let multipartymiddleware = multiparty();
 */

var userClass = require('../controller/user');


commonRouter.post('/signup', function(req, res){
    userClass.signUp(req.body, function(resp){
        res.json(resp);
    });
});

commonRouter.post('/login', function(req, res){
    console.log(req.body)
    userClass.login(req.body, function(resp){
        res.json(resp);
    });
});


commonRouter.post('/addExperience',function(req,res){
    userClass.addExperience(req.body._id,req.body.experience,function(resp){
        res.json(resp);
    })
})

commonRouter.get('/getExperience',function(req,res){
    userClass.getExperience(req.params.id,function(resp){
        res.json(resp);
    })
})






module.exports = {
    commonRouter: commonRouter,
    AuthRouter: AuthRouter    
}