const mongoose = require("mongoose");
require("dotenv").config();

async function connect() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_CONNECT_URL);
    console.log("Connect to MongoDB successfully");
  } catch (error) {
    console.log("Connect to MongoDB failed: " + error);
  }
}

module.exports = {connect};
