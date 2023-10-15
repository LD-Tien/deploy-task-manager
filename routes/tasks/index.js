const express = require("express");
const multer = require("multer-utf8");
const middlewares = require("../../app/middlewares");
const tasksController = require("../../app/controllers/TasksController");
const fileController = require("../../app/controllers/FileController");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/getTasks", middlewares.userVerify,tasksController.getTasks)
router.post("/addTask", middlewares.userVerify, tasksController.addTask)
router.put("/updateTask/:id", middlewares.userVerify, tasksController.updateTask)
router.put("/addSubTask/:parentTaskId", middlewares.userVerify, tasksController.addSubTask)
router.put("/updateSubTask/:parentTaskId/:subTaskId", middlewares.userVerify, tasksController.updateSubTask)
router.delete("/deleteTask/:id", middlewares.userVerify, tasksController.deleteTask, fileController.deleteFilesInTask)
router.put("/deleteSubTask/:parentTaskId/:subTaskId", middlewares.userVerify, tasksController.deleteSubTask)
router.post("/uploadFile/:taskId", middlewares.userVerify, upload.single("fileName"), fileController.uploadFile)
router.put("/deleteFile/:directory", middlewares.userVerify,  fileController.deleteFile, tasksController.updateTask)

module.exports = router;