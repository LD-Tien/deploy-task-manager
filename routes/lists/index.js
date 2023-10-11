const express = require("express");
const listsController = require("../../app/controllers/ListsController");
const usersController = require("../../app/controllers/UsersController");
const fileController = require("../../app/controllers/FileController");

const router = express.Router();

router.get("/getLists", usersController.auth, listsController.getLists);
router.post("/addNewList", usersController.auth, listsController.addNewList);
router.delete("/deleteList/:id", usersController.auth, listsController.deleteList, fileController.deleteFilesInList);
router.put("/updateList/:id", usersController.auth, listsController.updateList);

module.exports = router;