var mongoose = require('mongoose');
var _ = require('underscore');
var config = require('../config/config');
var userCollection = require('../models/user').userModel;
var userSocialCollection = require('../models/user').userSocialModel;
var utils = require('../common/utils');
const request = require('request-promise');
var async = require('async');





var Common = function () { };


module.exports = new Common();
