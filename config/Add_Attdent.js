const mongoose = require("mongoose");

const Add_AttendantParams= new mongoose.Schema(
{
  patientname:String,
  gender : String,
  prinumber:Number,
  secnumber:Number,
  relation:String,
  idproof:String,
  idnumber:String,
  address:String,
  assign:String,
  IdImage:String,
  pid:String,
  timestamp: { type: Date, default: Date.now }

})

module.exports = mongoose.model('add_attendant',Add_AttendantParams);