const { validationResult, body } = require("express-validator");
const config = require("../../config/firebase.config");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;

class UsersController {
  validateEmail = body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Wrong email format");

  validatePassword = body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4 })
    .withMessage("Password must have at least 4 characters");

  // [GET] /getUser
  getUser(req, res, next) {
    User.findOne(
      { _id: new ObjectId(req.userId) },
      { _id: 1, username: 1, email: 1 }
    )
      .then((user) => {
        return res.json(user);
      })
      .catch((error) => {
        return res.json({
          code: 400,
          error: error,
          message: "Failed to get user info from database",
        });
      });
  }

  // [POST] /login
  login(req, res, next) {
    const result = validationResult(req);
    if (result.errors.length) {
      return res.json({
        code: 400,
        errors: result.errors,
        message: "Login failed",
      });
    }
    User.findOne({ email: req.body.email, password: req.body.password })
      .then((user) => {
        if (user) {
          const token = jwt.sign(
            { _id: user._id },
            process.env.SERVER_PASSWORD
          );
          return res.json({
            code: 200,
            message: "Login successfully",
            token: token,
          });
        } else {
          return res.json({
            code: 400,
            message: "Incorrect email or password",
          });
        }
      })
      .catch(next);
  }

  // [POST] /signup
  signup(req, res, next) {
    const result = validationResult(req);
    if (result.errors.length) {
      return res.json({
        code: 400,
        errors: result.errors,
        message: "Signup failed",
      });
    }

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          return res.json({
            code: 400,
            message: "Email already exists",
          });
        } else {
          User.insertMany([
            { username: username, email: email, password: password },
          ])
            .then((user) => {
              const token = jwt.sign(
                { _id: user[0]._id },
                process.env.SERVER_PASSWORD
              );
              return res.json({
                code: 200,
                token: token,
                message: "Sign up successfully",
              });
            })
            .catch((error) => {
              return res.json({
                code: 400,
                error: error,
                message: "Sign up failed",
              });
            });
        }
      })
      .catch((error) => {
        return res.json({
          code: 400,
          error: error,
          message: "Sign up failed",
        });
      });
  }

  // [GET] /checkLoginToken
  checkLoginToken(req, res, next) {
    try {
      let payLoad = "";
      const token = req.cookies.TMToken;
      if (token) {
        payLoad = jwt.verify(token, process.env.SERVER_PASSWORD);
        if (payLoad._id) {
          return res.json(payLoad._id);
        }
      }
      return res.json(false);
    } catch (error) {
      return res.json(false);
    }
  }

  // isLogged(req, res, next) {
  //   try {
  //     let payLoad = "";
  //     const token = req.cookies.TMToken;
  //     if (token) {
  //       payLoad = jwt.verify(token, process.env.SERVER_PASSWORD);
  //       if (payLoad._id) {
  //         return res.json(true);
  //       }
  //     }
  //     return res.json(false);
  //   } catch (error) {
  //     return res.json(false);
  //   }
  // }

  auth(req, res, next) {
    try {
      let payLoad = "";
      const token = req.cookies.TMToken;
      if (token) {
        payLoad = jwt.verify(token, process.env.SERVER_PASSWORD);
        if (payLoad._id) {
          req.userId = payLoad._id;
          return next();
        }
      }
      return res.redirect("/login");
    } catch (error) {
      return res.redirect("/login");
    }
  }
}

module.exports = new UsersController();
