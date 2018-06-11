var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var db = require("../config/config").DB;

var options = {
  // live
  user: db.user,
  pass: db.password,
  useMongoClient: true,
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30
};
var connect = mongoose.connect(
  db.url,
  options
);
var connect = mongoose.connect(db.url);
var mongoConn = mongoose.connection;

mongoConn.on("error", function(err) {
  console.log("Error while connecting to data base", err);
});

mongoConn.once("open", function(err) {
  console.log("Sucessfully connected to data base");
});

var userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: Number },
    userType: { type: String, default: "superAdmin" },
    password: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
  },
  {
    timestamps: true
  }
);

var inventorySchema = mongoose.Schema({
  PNR: String,
  Source: String,
  Destination: String,
  DOJ: String,
  OperatorName: String,
  BusType: String,
  ServiceType: String,
  BoardingPoint: String,
  BoardingTime: String,
  DroppingPoint: String,
  DroppingTime: String,
  Email: String,
  Mobile: Number,
  Age: String,
  Gender: String,
  Insurance: String,
  insurance_amount: String,
  CouponCode: String,
  Discount_Amt: Number,
  WalletAmountRedemeed: String,
  PGAmount: Number,
  PGType: String,
  GSTAmount: Number,
  ServiceCharge: String,
  TicketAmount: Number,
  No_Of_Seats: Number,
  BookingPlatform: String,
  BookedDate: String,
  BookingTime: String,
  CancellationDate: String,
  CancellationTime: String,
  CancelledSeats: String,
  CancellationAmount: String,
  RefundGSTAmount: String,
  CustomerId: String,
  EdgeOfferAmount: String,
  APISource: String,
  Abhiid: String,
  Earnings: String,
  ReferenceNo: String,
  repetitive: Number
});

var pgDateAggregation = mongoose.Schema({
    _id: Object,
    count: Number,
    TicketAmount: Number
});
var UsersColl = connect.model("users", userSchema);
var InventoryColl = connect.model("inventories", inventorySchema, "inventories");

var pgDateAggregation = connect.model("pgDateAggregation", pgDateAggregation, "pgDateAggregation");

module.exports = {
  UsersColl: UsersColl,
  InventoryColl: InventoryColl,
  pgDateAggregation:pgDateAggregation
};
