const mongoose = require('mongoose');

const Package_ResChargesSchema= new mongoose.Schema
({
  patientid: String,
  patientname: String,
  doctor: String,
  fromDate: String,
  toDate: String,
  packagePrice: Number,
  ReceivableAmount:Number,
  deposit: Number,
  totalAmount: Number,
  balanceAmount:Number,
  AssignBedno:String,
  DiscountPercentage:Number,
  Discountflat:Number,
  DiscountAmount:Number,
  Narration:String,
  paymentMode:String,
  PymentUTRNo:Number,
  PaymentTransctionNo:Number,
  RecivedBy:String,
  Remark:String,
  RoomCategory:String,
  ReservationStatus:String,
  checkStatus:String,
  EntryDate:String
  
})

module.exports = mongoose.model('reservation_charges',Package_ResChargesSchema);

