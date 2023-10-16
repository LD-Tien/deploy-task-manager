const express = require("express");
const listsController = require("../../app/controllers/ListsController");
const middlewares = require("../../app/middlewares");

const router = express.Router();

router.get("/getLists", middlewares.userVerify, listsController.getLists);
router.post("/addNewList", middlewares.userVerify, listsController.addNewList);
router.delete("/deleteList/:id", middlewares.userVerify, listsController.deleteList);
router.put("/updateList/:id", middlewares.userVerify, listsController.updateList);

module.exports = router;