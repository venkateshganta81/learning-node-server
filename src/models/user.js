var mongoose = require("mongoose");
var dbCon = require("../config/config").dbConfig;
var mObjectId = mongoose.Schema.ObjectId;

var connection = mongoose.connect(
  dbCon.url,
  { user: dbCon.user, pass: dbCon.password }
);
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("ERROR CONNECTING TO DATABASE", err);
});

db.once("open", function callback() {
  console.log("CONNECTED TO MONGODB");
});

var userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    phone: Number,
    name: String,
    experience : []
  },
  {
    timestamps: true,
    versionKey: false
  }
);

var user = new mongoose.Schema({
    free : { type : Boolean , default : true },
    userName : String,
    email: { type: String, unique: true },
    mobile : Number,
    mentor : {
        mentorId : { type : mObjectId },
        name : String 
    },
    status : String
}, {
    timestamps: true,
    versionKey: false
})



var userSocialSchema = new mongoose.Schema({
    userId: { type: mObjectId, ref: 'users' },
    accountName: String,
    role: { type: String, default: 'user' },
    socialAccountFlag: { type: String, enum: ['facebook', 'google', 'twitter'] },
    sEmail: { type: String }
}, {
        timestamps: true,
        versionKey: false
    });

var mantraSchema = new mongoose.Schema(
  {
    userType: String,
    title: String,
    description: String,
    tags: [],
    pdfFiles: String,
    videoFile: String,
    userId: { type: mObjectId }
  },
  {
    timestamps: true,
    versionKey: false
  }
);


var employee = new mongoose.Schema({
  name : String,
  age : Number,
  email : String,
  gender : String,
  designation : String,
  bloodGroup : String,
  profilePic : String,
  mobile : String
})

var mantraModel = mongoose.model("mantras", mantraSchema);
var userModel = mongoose.model("users", userSchema);
var createdUserCollection = mongoose.model("createdUsers", user);
var employeeCollection = mongoose.model('employees',employee)
/* var userSocialModel = mongoose.model('socialusers', userSocialSchema); */

module.exports = {
  userModel: userModel,
  mantraModel: mantraModel,
  createdUserCollection: createdUserCollection,
  employeeCollection:employeeCollection
};
