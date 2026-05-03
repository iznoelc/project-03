/**
 * db.js
 * 
 * Sets up connection to the MongoDB database through Mongoose
 * 
 * @author Izzy Carlson
 */

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

/**
 * If not already connected, connect to the database and return the db instance 
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("MongoDB connected with Mongoose");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = { connectDB };