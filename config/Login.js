const mongoose = require("mongoose");

const Login_Schema = new mongoose.Schema
({
   username:String,
   password:String
})
module.exports=mongoose.model("admin",Login_Schema);