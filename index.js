require('./config/db');
const PatientRegistration = require('./config/patient_registration');
const Add_Attdence = require('./config/Add_Attdent');
const Package_ResChargesSchema =require('./config/Package_ReservationCharges');
const Payment_Settelment = require('./config/Package_Settelment');
const Package_modicationSchema = require('./config/Package_Modification');
const Login_Schema = require ('./config/Login')
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());

// ------------------------Registration Api-----------------------------

// ---------------------------validation Api-------------------------

app.get('/check_patient', async (req, res) => {
  try {
    const { number } = req.query;
    if (!number || number.length !== 10 || isNaN(number)) {
      return res.status(400).json({ success: false, message: "Invalid phone number format." });
    }
    const existingPatient = await PatientRegistration.findOne({
      $or: [{ prinumber: number }, { secnumber: number }]
    });

    if (existingPatient) {
      return res.status(200).json({
        success: true,
        exists: true,
        message: "This number is already registered."
      });
    } else {
      return res.status(200).json({
        success: true,
        exists: false,
        message: "Number is available."
      });
    }
  } catch (error) {
    console.error("Error in /check_patient API:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.get('/check_idproof', async (req, res) => {
  try {
    const { idproof, idnumber } = req.query;

    if (!idproof || !idnumber) {
      return res.status(400).json({ success: false, message: " ID Number are required." });
    }
    const existingRecord = await PatientRegistration.findOne({ idproof, idnumber });
    if (existingRecord) {
      return res.json({
        success: true,
        exists: true,
        message: "This ID number are already registered."
      });
    } else {
      return res.json({
        success: true,
        exists: false,
        message: "ID  number are available."
      });
    }
  } catch (error) {
    console.error("Error in /check_idproof API:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);  
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);  
  },
});
const upload = multer({ storage: storage });


app.post('/patient_registration', upload.single('file'), async (req, resp) => {
  try {
    const { patientname, gender, prinumber, secnumber, idproof, address, assign, idnumber } = req.body;
    const filePath = req.file ? `images/${req.file.filename}` : null;
    const patientregister = new PatientRegistration({
      patientname,gender,prinumber,secnumber,idproof,address,assign,idnumber,
      IdImage: filePath, 
    });

    const result = await patientregister.save();
    resp.send({ success: true, message: "Patient registered successfully", result });
  } catch (error) {
    resp.status(500).send({ success: false, message: "Error saving patient data" });
  }
});

//  -------------------Add Attdent Modification Api--------------------

app.post('/add_attdent', upload.single('file'), async (req, resp) => {
  try {
    const { patientname, gender, prinumber, secnumber, idproof, address, assign, idnumber,relation,pid } 
    = req.body;
   
    const filePath = req.file ? `images/${req.file.filename}` : null;
    const attendence = new Add_Attdence({
      patientname,gender,prinumber,secnumber,idproof,address,assign,idnumber,relation,pid,
      IdImage: filePath,timestamp: Date.now(), 
    });
    const result = await attendence.save();
    resp.send({ success: true, message: "Patient registered successfully", result });
  } catch (error) {
    resp.status(500).send({ success: false, message: "Error  added data" });
  }
});

// ----------------Transcation Api-----------------

app.get('/transaction/:patientname', async (req, res) => {
  try {
      const patientname = req.params.patientname;
      const result = await PatientRegistration.find({ patientname: { $regex: `^${patientname}$`, $options: 'i' } });

      if (result && result.length > 0) {
          res.status(200).json(result);
      } else {
          res.status(404).json({ message: "No Record Found!" });
      }
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/transactionHistory/:id", async (req, resp) => 
{
  let result = await PatientRegistration.findOne({ _id: req.params.id });
  if (result) 
  {
      resp.send(result);
  }
  else 
  {
      resp.send({ result: "No Record Found..!" });
  }
})


app.get('/resconfiguration/:searchValue', async (req, resp) => {
  try {
    const searchValue = req.params.searchValue;
    const query = isNaN(searchValue)
      ? { $or: [
          { patientname: { $regex: `^${searchValue}$`, $options: 'i' } }, 
          { idnumber: { $regex: `^${searchValue}$`, $options: 'i' } }, 
        ]}
      : { $or: [
          { prinumber: Number(searchValue) },
           { idnumber: { $regex: `^${searchValue}$`, $options: 'i' } },
        ]};

    const resconfig = await PatientRegistration.find(query);

    if (resconfig) {
      resp.send(resconfig);
    } else {
      resp.status(404).send({ message: "No Record Found" });
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    resp.status(500).send({ message: "Internal Server Error" });
  }
});


app.get('/res_charges/:id', async(req,resp)=>
{
  let result = await PatientRegistration.find({ _id: req.params.id });
  if (result) 
  {
      resp.send(result);
  }
  else 
  {
      resp.send({ result: "No Record Found..!" });
  }
})

app.get("/attedentmodification", async(req,resp) =>
{
  let result = await PatientRegistration.find();
  if(result)
  {
    resp.send(result);
  }
  else{
    resp.send({ result: "No Record Found..!" });
  }
})
app.get("/attedentmodificationinfo/:id", async(req,resp) =>
  {
    let result = await PatientRegistration.findOne({_id:req.params.id});
    if(result)
    {
      resp.send(result);
    }
    else{
      resp.send({ result: "No Record Found..!" });
    }
  })

  // ------------------ Attdent Api--------------

  app.get("/get_attdent", async(req,resp)=>
  {
    let result = await Add_Attdence.find();
    if(result)
    {
      resp.send(result);
    }
    else
    {
      resp.send({ result: "No Record Found..!" });
    }
  })


  app.get('/patientdata', async (req, res) => {
    try {
      const patients = await Add_Attdence.find();  
      res.setHeader('Content-Type', 'application/json'); 
      res.json(patients); 
    } catch (error) {
      res.status(500).json({ error: 'Server Error' });
    }
  });


  app.put('/update-attendant/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "ID parameter is missing" });
        }
        const updatedTimestamp = new Date(); 
        const result = await Add_Attdence.updateOne(
            { _id: id },{ $set: { timestamp: updatedTimestamp } }
        );

        if (result.modifiedCount > 0) {
            res.json({ success: true, message: "Timestamp updated successfully", timestamp: updatedTimestamp });
        } else {
            res.status(404).json({ success: false, message: "Attendant not found or no changes made" });
        }
      } catch (error) {
          res.status(500).json({ success: false, message: "Error updating timestamp", error: error.message });
      }
});

// -----------------Cash Reservation Api----------------

  app.post("/Package_reservation_charges", async (req, resp) =>
    {
    let packagedata = new Package_ResChargesSchema(req.body);
    let response = await packagedata.save();
    resp.send(response);
  });

   app.get('/reservation_charges', async (req, resp) => {
    let chrgesdata = await Package_ResChargesSchema.find();
    if (chrgesdata.length > 0)
   {
      resp.send(chrgesdata);
    }
    else {
        resp.send({ result: "No Record Found.." })
    }
})

// -----------------Reserved Patient Get data-----------------

app.get('/registration_reserved_patient', async (req, resp) => {
  try {
      let reservedData = await PatientRegistration.find();

      if (reservedData.length > 0) {
          resp.status(200).json(reservedData);
      } else {
          resp.status(404).json({ message: "No data found for this patient" });
      }
  } catch (error) {
      resp.status(500).json({ error: "Server Error", details: error.message });
  }
});

// ----------------Check In Api------------------
app.get('/checkin/:id', async (req, resp) => {
  try {
      let reservedData = await Package_ResChargesSchema.find({_id:req.params.id});
      if (reservedData.length > 0) {
          resp.status(200).json(reservedData);
      } else {
          resp.status(404).json({ message: "No data found for this patient" });
      }
  } catch (error) {
      resp.status(500).json({ error: "Server Error", details: error.message });
  }
});

app.put("/add_checkin/:resid", async(req,resp)=>
{
  let checkstatus = await Package_ResChargesSchema.updateOne(
      {_id:req.params.resid},
      {$set:req.body}
  )
  resp.send(checkstatus);

})

// ----------------Check Out Api------------------
app.get("/payment_settlement/:id", async(req,resp)=>
{
   let paysettlementdata = await Package_ResChargesSchema.findOne({_id : req.params.id});
   if(paysettlementdata)
    {
      resp.send(paysettlementdata);
    }
    else{
      resp.send({ paysettlementdata: "No Record Found..!" });
    }
})

app.get("/chckedattdent", async (req, resp) => {
  try {
    const attdentdata = await Add_Attdence.find();
    if (attdentdata.length > 0) {
      resp.json(attdentdata);
    } else {
      resp.status(404).json({ message: "No Record Found..!" });
    }
  } catch (error) {
    console.error("Error fetching attendance data: ", error);
    resp.status(500).json({ message: "Internal Server Error" });
  }
});
  
app.get("/patient_registration_api", async (req, resp) => {
  try {
    const data = await PatientRegistration.find();
    if (data.length > 0) {
      resp.json(data);
    } else {
      resp.status(404).json({ message: "No records found" });
    }
  } catch (error) {
    console.error("Error fetching patient registration data: ", error);
    resp.status(500).json({ message: "Internal Server Error" });
  }
});

// ----------------Package Settelment Api-------------

app.post("/payment_settelment", async (req, resp) => {
  try {
    const paymentData = new Payment_Settelment(req.body);
    let result = await paymentData.save();
    resp.json(result);
  } catch (error) {
    resp.status(500).json({ error: 'Something went wrong' });
  }
});

// ----------------Search Check in  Api-------------

app.get("/chechinsearch", async(req,resp)=>
{
    let searchdata = await Package_ResChargesSchema.find();
    let response = await searchdata.json();
    resp.send(response);
})

app.get('/checkin_search/:patientname', async (req, res) => {
  try {
      const patientname = req.params.patientname;
      const result = await Package_ResChargesSchema.find({ patientname: { $regex: `^${patientname}$`, $options: 'i' } });

      if (result && result.length > 0) {
          res.status(200).json(result);
      } else {
          res.status(404).json({ message: "No Record Found!" });
      }
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// --------------------- Check Out Transcation History---------------
app.get("/checkout_transctiondetails", async (req, resp) => {
  let allTransactions = await Package_ResChargesSchema.find(); 
  resp.send(allTransactions);
});

app.get("/checkout_transctiondetails/:id", async (req, resp) => {
  let accountdata = await Package_ResChargesSchema.findOne({_id: req.params.id });
  if (accountdata) {
    resp.send(accountdata);
  } else {
    resp.status(404).send({ result: "No Record Found..!" });
  }
});

app.get("/checkout_paysettelment/:id", async (req, resp) => {
  let settelment = await Payment_Settelment.findOne({resid:req.params.id}); 
  resp.send(settelment);
});


app.get("/checkout_settelment/:pid", async (req, resp) => {
  try {
    let settelment = await Payment_Settelment.findOne({ resid: req.params.pid });
    if (!settelment) {
      return resp.status(404).json({ message: "No data found" });
    }
    resp.json(settelment);
  } catch (error) {
    console.error("Database error:", error);
    resp.status(500).json({ message: "Server error" });
  }
});

// --------------------- Check IN Transcation History---------------

app.get("/checkin_transctiondetails", async (req, resp) => {
  let allTransactions = await Package_ResChargesSchema.find(); 
  resp.send(allTransactions);
});

app.get("/checkin_transctiondetails/:id", async (req, resp) => {
  let accountdata = await Package_ResChargesSchema.findOne({patientid: req.params.id });
  if (accountdata) {
    resp.send(accountdata);
  } else {
    resp.status(404).send({ result: "No Record Found..!" });
  }
});


// ------------------Chck in Print Transcation Detils--------------

app.get("/print_transctiondetails/:id", async (req, resp) => {
  let allTransactions = await Package_ResChargesSchema.find({patientid:req.params.id}); 
  resp.send(allTransactions);
});


// ---------------- Reort List-------------------

app.get("/report_list", async (req, resp) => {
  let allTransactions = await Package_ResChargesSchema.find(); 
  resp.send(allTransactions);
});

app.get("/report_transction", async (req, resp) => {
  let allTransactions = await Payment_Settelment.find(); 
  resp.send(allTransactions);
});


app.get("/patient_registration", async(req,resp)=>
{
   let registrationdata =  await PatientRegistration.find();
   if(registrationdata.length>0)
   {
    resp.send(registrationdata)
   }
   else{
    resp.send({registrationdata:"No Record Found"});
   }
})

app.post("/packagemodification", async (req, resp) =>
  {
  let packagedata = new Package_modicationSchema(req.body);
  let response = await packagedata.save();
  resp.send(response);
});

app.get("/Package_modificationData/:id", async (req, resp) => {
  let accountdata = await Package_modicationSchema.findOne({patientid: req.params.id });
  if (accountdata) {
    resp.send(accountdata);
  } else {
    resp.status(404).send({ result: "No Record Found..!" });
  }
});

app.get("/Package_modification", async (req, resp) => {
  let accountdata = await Package_modicationSchema.find();
  if (accountdata) {
    resp.send(accountdata);
  } else {
    resp.status(404).send({ result: "No Record Found..!" });
  }
});

app.get("/package_data/:id", async (req, resp) => {
  let accountdata = await Package_modicationSchema.find({patientid: req.params.id });
  if (accountdata) {
    resp.send(accountdata);
  } else {
    resp.status(404).send({ result: "No Record Found..!" });
  }
});



app.put("/change_status/:patientid", async (req, resp) => {
  let result = await Package_ResChargesSchema.updateOne(
      { patientid: req.params.patientid },
      { $set: req.body }
  )
  resp.send(result);
});

app.put("/package_status/:patientid", async (req, resp) => {
  let result = await Package_modicationSchema.updateOne(
      { patientid: req.params.patientid },
      { $set: req.body }
  )
  resp.send(result);
});

app.post("/login", async (req, resp) => {
  try {
    const { username, password } = req.body;
    const user = await Login_Schema.findOne({ username, password });
    if (user) {
      return resp.json({ success: true, message: "Login successful", user });
    } else {
      return resp.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Server Error:", error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/search_registration/:id", async (req, resp) => {
  let registrationdata = await PatientRegistration.find({ _id: req.params.id });
  if (registrationdata.length > 0) {
    resp.status(200).json(registrationdata);
  } else {
    resp.status(404).json({ message: "No Record Found" });
  }
});


app.listen(4000, '0.0.0.0', () => {
  console.log('Server running on port 4000');
});