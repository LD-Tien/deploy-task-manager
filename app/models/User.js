const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema(
  {
    "email": {
      "type": "String"
    },
    "password": {
      "type": "Date"
    },
    "__v": {
      "type": "Number"
    },
    "username": {
      "type": "String"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
