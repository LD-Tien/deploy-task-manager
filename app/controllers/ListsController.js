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
      .catch(console.log);
  }

  // [POST] /addNewList
  addNewList(req, res, next) {
    List.insertMany([
      { title: req.body.title, owner: new ObjectId(req.userId) },
    ])
      .then((newList, err) => {
        if (err) {
          return res.send(err);
        }
        return res.json({
          code: 200,
          data: newList[0],
          message: "Add list successfully",
        });
      })
      .catch(console.log);
  }

  // [PUT] /updateList/:id
  updateList(req, res, next) {
    List.updateOne({ _id: new ObjectId(req.params.id) }, req.body)
      .then(() => {
        res.json({
          code: 200,
          data: req.params.id,
          message: "Update list successfully",
        });
      })
      .catch(console.log);
  }

  // [DELETE] /deleteList/:id
  deleteList(req, res, next) {
    Task.find({owner: new ObjectId(req.userId), listId: req.params.id})
      .then((tasks) => {
        req.tasksDelete = tasks
        next(); // delete files in tasks
      })
    List.deleteOne({ _id: new ObjectId(req.params.id) })
      .then(() => {
        Task.deleteMany({ listId: new ObjectId(req.params.id) }).then(() => {
          res.json({
            code: 200,
            data: req.params.id,
            message: "Delete list successfully",
          });
        });
      })
      .catch(console.log);
  }
}

module.exports = new ListsController();
