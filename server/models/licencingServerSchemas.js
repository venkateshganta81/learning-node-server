var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

var dbConfig=require('./../config/config').licencingServerDB;


 var connect2= mongoose.createConnection(dbConfig.url, dbConfig.options);
//var connect2=mongoose.createConnection('mongodb://localhost/chakravarthysir');



var userSchemaW = new Schema({
    firstName: String ,
    lastName: String ,
    mobile: Number ,
    email:String ,
    hash: String ,
    noOfdays:{type:Number,default:0},
    userType:String,
    macIp:{type:String,default:'0000'},
    userActive:{type:Boolean,default:false},
    studentType:{type:String},
    dateOfCreation:{type:Date},
    dateOfActivation:{type:Date},
    history:[{type:Date}],
    courseType:[{type: mongoose.Schema.Types.ObjectId, ref: 'courses'}]

});

var coursesSchema = new Schema({
    courseName:String
});



var PenDriveUsersColl=connect2.model('users', userSchemaW);
var PenDriveCourseColl=connect2.model('courses', coursesSchema);connect2

module.exports = {
    PenDriveCourseColl:PenDriveCourseColl,
    PenDriveUsersColl:PenDriveUsersColl

};
