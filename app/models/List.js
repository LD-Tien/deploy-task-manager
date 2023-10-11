const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const List = new Schema(
  {
    title: {
      type: "String",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("List", List);
