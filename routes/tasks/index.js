const express = require("express");
const middlewares = require("../../app/middlewares");
const tasksController = require("../../app/controllers/TasksController");

const router = express.Router();

router.get("/getTasks", middlewares.userVerify,tasksController.getTasks)
router.post("/addTask", middlewares.userVerify, tasksController.addTask)
router.put("/updateTask/:id", middlewares.userVerify, tasksController.updateTask)
router.put("/addSubTask/:parentTaskId", middlewares.userVerify, tasksController.addSubTask)
router.put("/updateSubTask/:parentTaskId/:subTaskId", middlewares.userVerify, tasksController.updateSubTask)
router.delete("/deleteTask/:id", middlewares.userVerify, tasksController.deleteTask)
router.put("/deleteSubTask/:parentTaskId/:subTaskId", middlewares.userVerify, tasksController.deleteSubTask)

module.exports = router;