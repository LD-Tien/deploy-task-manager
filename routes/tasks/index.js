const express = require("express");
const multer = require("multer-utf8");
const tasksController = require("../../app/controllers/TasksController");
const usersController = require("../../app/controllers/UsersController");
const fileController = require("../../app/controllers/FileController");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/getTasks",usersController.auth, tasksController.getTasks)
router.post("/addTask", usersController.auth, tasksController.addTask)
router.put("/updateTask/:id", usersController.auth, tasksController.updateTask)
router.put("/addSubTask/:parentTaskId", usersController.auth, tasksController.addSubTask)
router.put("/updateSubTask/:parentTaskId/:subTaskId", usersController.auth, tasksController.updateSubTask)
router.delete("/deleteTask/:id", usersController.auth, tasksController.deleteTask, fileController.deleteFilesInTask)
router.put("/deleteSubTask/:parentTaskId/:subTaskId", usersController.auth, tasksController.deleteSubTask)
router.post("/uploadFile/:taskId", upload.single("fileName"), usersController.auth,fileController.uploadFile)
router.put("/deleteFile/:directory",  usersController.auth,fileController.deleteFile, tasksController.updateTask)

module.exports = router;