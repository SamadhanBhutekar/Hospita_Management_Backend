const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin%40123@admin.fvwcg.mongodb.net/Hospital_Management?retryWrites=true&w=majority&appName=admin')
  mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error("MongoDB Connection Error:", error));

