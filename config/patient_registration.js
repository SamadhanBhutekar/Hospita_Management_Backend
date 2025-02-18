const mongoose = require('mongoose');

const PatientRegistrationScema = new mongoose.Schema
({
    patientname:String,
    gender : String,
    prinumber:Number,
    secnumber:Number,
    idproof:String,
    idnumber:String,
    address:String,
    assign:String,
    IdImage:String
   
})
module.exports = mongoose.model('patient_registration',PatientRegistrationScema);