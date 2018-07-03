var express = require('express');
var commonRouter = express.Router();
var AuthRouter = express.Router();
var commonClass = require('../controller/common');

AuthRouter.get('/getFollowers',function (req,res) {
    commonClass.getFollowers(function (result) {
        res.json(result);
    })
});

AuthRouter.get('/facebook/getFeedAnalytics/:pageName',function (req,res) {
    commonClass.getFeedAnalytics(req.params.pageName,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/facebook/getCommentAnalytics/:pageName',function (req,res) {
    commonClass.getCommentAnalytics(req.params.pageName,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/facebook/getSuperFan/:pageName',function (req,res) {
    commonClass.getSuperFans(req.params.pageName,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/facebook/getTrendingFan/:pageName',function (req,res) {
    commonClass.getTrendingFans(req.params.pageName,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/facebook/getLikesAndFollowersForPage/:pageName',function (req,res) {
    commonClass.getLikesAndFollowersForPage(req.params.pageName,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/facebook/getFanAnalytics/:fanId',function (req,res) {
    commonClass.getFanAnalytics(req.params.fanId,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/facebook/getInfluencersInRange/:category?/:range?',function (req,res) {
    commonClass.getInfluencersInRange(req.params.category,req.params.range,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/youtube/getFeedAnalytics/:id',function (req,res) {
    commonClass.getYoutubeFeedAnalytics(req.params.id,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/youtube/getCommentAnalytics/:id',function (req,res) {
    commonClass.getYoutubeCommentAnalytics(req.params.id,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/youtube/getSuperFan/:id',function (req,res) {
    commonClass.getYoutubeSuperFans(req.params.id,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/youtube/getFanAnalytics/:id/:channelId',function (req,res) {
    commonClass.getYoutubeFanAnalytics(req.params.id,req.params.channelId,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/youtube/getTrendingFan/:id',function (req,res) {
    commonClass.getYoutubeTrendingFan(req.params.id,function (result) {
        res.json(result);
    })
})

AuthRouter.get('/youtube/getLikesAndFollowersForPage/:id',function (req,res) {
    commonClass.getYoutubeLikesAndFollowersForPage(req.params.id,function (result) {
        res.json(result);
    })
});

AuthRouter.post( '/socialInfluencers' , function(req,res){
    console.log(req.body)
    commonClass.getInfluencerIds(req.body , function(resp){
        res.json(resp);
    })
});

AuthRouter.post( '/socialProfileDetails' , function(req,res){
    commonClass.getInfluencerDetails(req.body , function(resp){
        res.json(resp);
    })
});

AuthRouter.get('/youtube/getInfluencersInRange/:category?/:range?',function (req,res) {
    commonClass.getYoutubeInfluencersInRange(req.params.category,req.params.range,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/twitter/getFeedAnalytics/:id',function (req,res) {
    commonClass.getTwitterFeedAnalytics(req.params.id,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/twitter/getCommentAnalytics/:id',function (req,res) {
    commonClass.getTwitterCommentAnalytics(req.params.id,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/twitter/getTwitterLikesAndFollowersForPage/:id',function (req,res) {
    commonClass.getTwitterLikesAndFollowersForPage(req.params.id,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/twitter/getSuperFan/:id',function (req,res) {
    commonClass.getTwitterSuperFan(req.params.id,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/twitter/getTrendingFan/:id',function (req,res) {
    commonClass.getTwitterTrendingFans(req.params.id,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/twitter/getFanAnalytics/:id/:channelId',function (req,res) {
    commonClass.getTwitterFanAnalytics(req.params.id,req.params.channelId,function (result) {
        res.json(result);
    })
});

AuthRouter.get('/twitter/getInfluencersInRange/:category?/:range?',function (req,res) {
    commonClass.getTwitterInfluencersInRange(req.params.category,req.params.range,function (result) {
        res.json(result);
    })
});


AuthRouter.get('/youtube/authUrl',function(req,res){
    commonClass.getYoutubeAuthData(function(resp){
        res.redirect(resp);
    })
});

AuthRouter.get('/youtube/return',function (req,res) {
    commonClass.getYoutubeDetails(req.query.code,function (result) {
        if(result.status) {
            res.cookie('socialUID', result.results.socialUID);
            res.cookie('accountName', result.results.accountName);
            res.cookie('profilePic',result.results.profilePic);
            res.cookie('socialAccountFlag',result.results.socialAccountFlag);
            //res.redirect('http://localhost:4200/select-category');
            res.redirect('https://sfan.io/select-category');
        }
    })
});

module.exports = {
    commonRouter: commonRouter,
    AuthRouter: AuthRouter
}