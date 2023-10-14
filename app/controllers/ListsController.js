const List = require("../models/List");
const Task = require("../models/Task");
const { ObjectId } = require("mongoose").Types;

class ListsController {
  // [GET] /getLists
  getLists(req, res, next) {
    List.find({ owner: new ObjectId(req.userId) })
      .then((lists) => {
        return res.json({
          code: 200,
          data: lists,
          message: "Get lists successfully",
        });
      })
      .catch((error) => {
        return res.json({
          code: 400,
          error: error.message,
          message: "Get lists failed",
        });
      });
  }

  // [POST] /addNewList
  addNewList(req, res, next) {
    const list = new List({ ...req.body, owner: new ObjectId(req.userId) });
    List.insertMany([list])
      .then((newList) => {
        return res.json({
          code: 200,
          data: newList[0],
          message: "Add list successfully",
        });
      })
      .catch((err) => {
        return res.status(400).json({
          code: 400,
          error: err.message,
          message: "Add list failed",
        });
      });
  }

  // [PUT] /updateList/:id
  updateList(req, res, next) {
    List.updateOne({ listId: req.params.id }, req.body)
      .then(() => {
        return res.json({
          code: 200,
          message: "Update list successfully",
        });
      })
      .catch((error) => {
        return res.json({
          code: 400,
          error: error.message,
          message: "Update list failed",
        });
      });
  }

  // [DELETE] /deleteList/:id
  deleteList(req, res, next) {
    Task.find({ owner: new ObjectId(req.userId), listId: req.params.id }).then(
      (tasks) => {
        if (tasks) {
          req.tasksDelete = tasks;
          Task.deleteMany({ listId: req.params.id });
          next(); // delete files in tasks
        }
      }
    );

    List.deleteOne({ listId: req.params.id })
      .then(() => {
        Task.deleteMany({ listId: req.params.id }).then(() => {
          return res.json({
            code: 200,
            data: req.params.id,
            message: "Delete list successfully",
          });
        });
      })
      .catch((error) => {
        return res.json({
          code: 400,
          error: error.message,
          message: "Delete list failed",
        });
      });
  }
}

module.exports = new ListsController();
