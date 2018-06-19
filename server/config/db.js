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

