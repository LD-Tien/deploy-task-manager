const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const List = new Schema(
  {
    listId: String,
    title: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("List", List);
