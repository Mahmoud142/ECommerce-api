require('dotenv').config();
const mongoose = require('mongoose');
const URI = process.env.URI;



const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};


module.exports = connectDB;