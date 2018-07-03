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

commonRouter.post('/verifyOtp',function(req,res){
    userClass.verifyOtp(req.body,function(resp){
        res.json(resp);
    })
})

commonRouter.post('/resendOtp',function(req,res){
    userClass.resendOtp(req.body,function(resp){
        res.json(resp);
    })
})

commonRouter.post('/forgotPassword',function(req,res){
    userClass.forgotPassword(req.body.email,function(resp){
        res.json(resp);
    })
})


commonRouter.post('/login', function(req, res){
    console.log(req.body)
    userClass.login(req.body, function(resp){
        res.json(resp);
    });
});



commonRouter.post('/resetPassword',function(req,res){
    userClass.resetPassword(req.body.id ,req.body.passwords , function(resp){
        res.json(resp);
    })
});

commonRouter.post('/changePassword',function(req,res){
    userClass.changePassword(req.body.id,req.body.currentPassword,req.body.passwords,function(resp){
        res.json(resp);
    })
})


commonRouter.post('/addNewUser',function(req,res){
    userClass.addNewuser(req.body,function(resp){
        res.json(resp);
    })
});

commonRouter.post('/editProfile',function(req,res){
    userClass.editProfile(req.body.id,req.body.about,function(resp){
        res.json(resp);
    })
})


commonRouter.get('/getAllUsers/:id',function(req,res){
    userClass.getAllUsers(req.params.id,function(resp){
        res.json(resp);
    });
});

commonRouter.get('/getProfile/:id',function(req,res){
    console.log(req.params)
    userClass.getProfile(req.params.id,function(resp){
        res.json(resp);
    })
})


commonRouter.post('/userEditProfile',function(req,res){
    userClass.userEditProfile(req.body.id,req.body.details,function(resp){
        res.json(resp);
    })
})

commonRouter.post('/social/login', function(req, res){
    userClass.socialLogin(req.body, function(resp){
        res.json(resp);
    });
});

commonRouter.get('/checkEmail/:id?',function (req,res) {
    userClass.checkEmail(req.params.id,function (result) {
        res.json(result);
    })
});


commonRouter.post('/updateManagerSurvey',function (req,res) {
    console.log('req.body.id',req.body.id);
    userClass.updateManagerSurvey(req.body.id,function (result) {
        res.json(result);
    })
});

commonRouter.post('/updateManagerProfileImage',function (req,res) {
    userClass.updateManagerProfileImage(req.body,function (result) {
        res.json(result);
    })
});

commonRouter.get('/getStatus' , function(req,res){
    userClass.getStatus(function (result) {
        res.json(result);
    })
})

// AUTHENTICATED ROUTES FOLLOWS

// To update social account related details, brand or influencer names, account type etc...
commonRouter.post('/update/social/details', function(req, res){
    userClass.updateSocialDetails(req.body, function(resp){
        res.json(resp);
    });
});

// Fetch super user related account details
AuthRouter.get('/related/accounts', function(req, res){
    userClass.fetchRelatedAccounts(req.jwt, function(resp){
        res.json(resp);
    });
});

module.exports = {
    commonRouter: commonRouter,
    AuthRouter: AuthRouter    
}