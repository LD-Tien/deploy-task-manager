const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema(
  {
    userId: String,
    email: String,
    password: String,
    username: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
