var mongoose = require('./../../node_modules/mongoose');
var db=require('./../config/config').licencingServerDB;
var connect=mongoose.createConnection(db.url,db.options);
var mongoConn = mongoose.connection;

mongoConn.on('error', function (err) {
    console.log('Error while connecting to data base', err);
});

mongoConn.once('open', function (err) {
    console.log('Sucessfully connected to data base');
});

module.exports = {connect:connect};