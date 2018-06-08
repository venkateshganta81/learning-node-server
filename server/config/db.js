var mongoose = require('mongoose');
var db=require('./../config/config').DB;

var connect = mongoose.createConnection(db.url);
var mongoConn = mongoose.connection;

mongoConn.on('error', function (err) {
    console.log('Error while connecting to data base', err);
});

mongoConn.once('open', function (err) {
    console.log('Sucessfully connected to data base');
});

module.exports = {connect:connect};


module.exports = {
    url: "mongodb://localhost/abhibus"
};

/* module.exports = {
    url: "mongodb://localhost/hats-ai",
    user: 'hatsai',
    password: 'hatsai@123#MTW>81'
}; */

/* 
db.createUser(
    {
        user: "hatsai",
        pwd: "hatsai@123#MTW>81",
        roles: [ { role: "dbOwner", db: "hats-ai" } ]
    }) */