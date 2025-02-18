const mongoose = require("mongoose");

const Package_ModificationSchema= new mongoose.Schema(
  {
      patientid:String,
      RoomCategory:String,
      NewRoomCategory:String,
      fromDate:String,
      toDate:String,
      packagePrice:Number,
      RefundAmount:Number,
      ReceivableAmount:Number,
      AssignBedno:String,
      balanceAmount:Number,
      EntryDate:String,
      status:String,
      packageStatus:String
  }
)
module.exports = mongoose.model('pakage_modifications',Package_ModificationSchema);
