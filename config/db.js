const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin%40123@admin.fvwcg.mongodb.net/Hospital_Management?retryWrites=true&w=majority&appName=admin')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

