const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    taskId: String,
    title: String,
    subTasks: [Schema.Types.Mixed],
    note: {
      content: String,
      updatedAt: Date,
    },
    files: [Schema.Types.Mixed],
    planned: Date,
    remind: Date,
    repeat: String,
    isSendNotification: Boolean,
    myDay: Boolean,
    isImportant: Boolean,
    isCompleted: Boolean,
    listId: {
      type: String,
      ref: "List",
    },
    owner: String,
    
    partners: [Schema.Types.Mixed],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
