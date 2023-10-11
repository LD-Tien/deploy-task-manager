const Task = require("../models/Task");
const ObjectId = require("mongoose").Types.ObjectId;

class TasksController {
  // [GET] /getTasks
  getTasks(req, res, next) {
    Task.find({ owner: new ObjectId(req.userId) })
      .sort({ updatedAt: -1 })
      .then((tasks) => {
        return res.json({
          code: 200,
          data: tasks,
          message: "Get task successfully",
        });
      })
      .catch(console.log);
  }

  // [POST] /addTask
  addTask(req, res, next) {
    const addTask = new Task({ ...req.body, owner: req.userId });
    Task.insertMany([addTask])
      .then((task) => {
        return res.json({
          code: 200,
          data: task[0],
          message: "Add task successfully",
        });
      })
      .catch(console.log);
  }

  // [PUT] /updateTask/:id
  updateTask(req, res, next) {
    const updateTask = new Task(req.body);
    Task.updateOne({ _id: updateTask.id, owner: updateTask.owner }, updateTask)
      .then(() => {
        return res.json({
          code: 200,
          data: updateTask,
          message: "Update task successfully",
        });
      })
      .catch(console.log);
  }

  // [PUT] /addSubTask/:parentTaskId
  addSubTask(req, res, next) {
    const idSubTask = new ObjectId();
    Task.updateOne(
      {
        _id: new ObjectId(req.params.parentTaskId),
        owner: new ObjectId(req.userId),
      },
      {
        $push: {
          subTasks: {
            ...req.body,
            _id: idSubTask,
          },
        },
      }
    )
      .then(() => {
        return res.json({
          code: 200,
          data: { _id: idSubTask.toString(), ...req.body },
          message: "Add SubTask successfully",
        });
      })
      .catch(console.log);
  }

  // [PUT] /updateSubTask/:parentTaskId/:subTaskId
  updateSubTask(req, res, next) {
    Task.updateOne(
      {
        _id: new ObjectId(req.params.parentTaskId),
        owner: new ObjectId(req.userId),
        "subTasks._id": new ObjectId(req.params.subTaskId),
      },
      {
        $set: {
          "subTasks.$": {
            ...req.body,
            _id: new ObjectId(req.params.subTaskId),
          },
        },
      }
    )
      .then(() => {
        return res.json({
          code: 200,
          data: req.body,
          message: "Update subtask successfully",
        });
      })
      .catch((err) => console.log(err));
  }

  // [DELETE] /deleteTask/:id
  deleteTask(req, res, next) {
    Task.deleteOne({ _id: req.params.id })
      .then(() => {
        res.json({
          code: 200,
          message: "Delete task successfully",
        });
        next();
      })
      .catch((err) => console.log(err));
  }

  // [PUT] /deleteSubTask/:parentTaskId/:subTaskId
  deleteSubTask(req, res, next) {
    Task.updateOne(
      {
        _id: new ObjectId(req.params.parentTaskId),
        owner: new ObjectId(req.userId),
      },
      {
        $pull: {
          subTasks: {
            _id: new ObjectId(req.params.subTaskId),
          },
        },
      }
    )
      .then(() => {
        return res.json({
          code: 200,
          message: "Delete subtask successfully",
        });
      })
      .catch(console.log);
  }
}

module.exports = new TasksController();
