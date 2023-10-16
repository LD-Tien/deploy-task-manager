const Task = require("../models/Task");

class TasksController {
  // [GET] /getTasks
  getTasks(req, res, next) {
    Task.find({ owner: req.userId })
      .sort({ updatedAt: -1 })
      .then((tasks) => {
        return res.json({
          code: 200,
          data: tasks,
          message: "Get tasks successfully",
        });
      })
      .catch((error) => {
        return res.json({
          code: 400,
          error: error.message,
          message: "Get tasks failed",
        });
      });
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
      .catch((error) => {
        return res.json({
          code: 400,
          error: error.message,
          message: "Add task failed",
        });
      });
  }

  // [PUT] /updateTask/:id
  updateTask(req, res, next) {
    const updateTask = new Task(req.body);
    Task.updateOne(
      { taskId: updateTask.taskId, owner: updateTask.owner },
      updateTask
    )
      .then(() => {
        return res.json({
          code: 200,
          data: updateTask,
          message: "Update task successfully",
        });
      })
      .catch((error) => {
        return res.json({
          code: 400,
          error: error.message,
          message: "Update task failed",
        });
      });
  }

  // [PUT] /addSubTask/:parentTaskId
  addSubTask(req, res, next) {
    Task.updateOne(
      {
        taskId: req.params.parentTaskId,
        owner: req.userId,
      },
      {
        $push: {
          subTasks: {
            ...req.body,
          },
        },
      }
    )
      .then(() => {
        return res.json({
          code: 200,
          data: req.body,
          message: "Add subtask successfully",
        });
      })
      .catch((error) => {
        return res.json({
          code: 400,
          error: error.message,
          message: "Add subtask failed",
        });
      });
  }

  // [PUT] /updateSubTask/:parentTaskId/:subTaskId
  updateSubTask(req, res, next) {
    Task.updateOne(
      {
        taskId: req.params.parentTaskId,
        owner: req.userId,
        "subTasks.subTaskId": req.params.subTaskId,
      },
      {
        $set: {
          "subTasks.$": {
            ...req.body,
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
      .catch((error) => {
        return res.json({
          code: 400,
          error: error.message,
          message: "Update subtask failed",
        });
      });
  }

  // [DELETE] /deleteTask/:id
  deleteTask(req, res) {
    Task.deleteOne({ taskId: req.params.id })
      .then(() => {
        return res.json({
          code: 200,
          message: "Delete task successfully",
        });
      })
      .catch((error) => {
        return res.json({
          code: 400,
          error: error.message,
          message: "Delete task failed",
        });
      });
  }

  // [PUT] /deleteSubTask/:parentTaskId/:subTaskId
  deleteSubTask(req, res, next) {
    Task.updateOne(
      {
        taskId: req.params.parentTaskId,
        owner: req.userId,
      },
      {
        $pull: {
          subTasks: {
            subTaskId: req.params.subTaskId,
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
      .catch((error) => {
        return res.json({
          code: 400,
          error: error.message,
          message: "Delete subtask failed",
        });
      });
  }
}

module.exports = new TasksController();
