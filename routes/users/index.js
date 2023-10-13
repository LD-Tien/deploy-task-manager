const express = require("express");
const usersController = require("../../app/controllers/UsersController");
const { body } = require("express-validator");

const router = express.Router();

router.get("/getUser", usersController.auth, usersController.getUser);
router.get("/home", usersController.auth);
// router.get("/isLogged", usersController.isLogged);
router.post(
  "/login",
  usersController.validateEmail,
  usersController.validatePassword,
  usersController.login
);
router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 4 }),
  usersController.signup
);
router.get("/checkLoginToken", usersController.checkLoginToken);

module.exports = router;
