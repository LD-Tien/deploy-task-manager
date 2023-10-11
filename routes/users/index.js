const express = require("express");
const usersController = require("../../app/controllers/UsersController");

const router = express.Router();

router.get("/getUser", usersController.auth, usersController.getUser)
router.get("/home", usersController.auth);
router.get("/isLogged", usersController.isLogged)
router.post("/login", usersController.login);
router.post("/signup", usersController.signup);
router.get("/checkLoginToken", usersController.checkLoginToken);

module.exports = router;
