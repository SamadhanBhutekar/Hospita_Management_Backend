const mongoose = require("mongoose");

const payment_Settelment_Schema = new mongoose.Schema
({
    
  resid:String,
  patientid:String,
  AssignBedno:String,
  RefundAmount:Number,
  paymentMode:String,
  Narration:String,
  PymentUTRNo:String,
  PaymentTransctionNo:String,
  RecivedBy:String,
  Remark:String,
  transcatonDate:String,

})

module.exports=mongoose.model("payment_settelments",payment_Settelment_Schema);