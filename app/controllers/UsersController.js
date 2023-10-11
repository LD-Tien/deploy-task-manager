const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;

class UsersController {
  // [GET] /getUser
  getUser(req, res, next) {
    User.findOne({_id: new ObjectId(req.userId)}, {_id: 1, username: 1, email: 1})
      .then(user => {
        res.json(user);
      })
      .catch(next);
  }

  // [POST] /login
  login(req, res, next) {
    User.findOne({ email: req.body.email, password: req.body.password })
      .then((user) => {
        if (user) {
          const token = jwt.sign({ _id: user._id }, process.env.SERVER_PASSWORD);
          return res.json({
            message: "Login successfully",
            token: token,
          });
        } else {
          return res.json({ errorMessage: "Incorrect email or password" });
        }
      })
      .catch(next);
  }

  // [POST] /signup
  signup(req, res, next) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          return res.json({
            errorMessage: "Email already exists",
          });
        } else {
          User.insertMany([{ username: username, email: email, password: password}])
            .then((user) => {
              const token = jwt.sign({ _id: user[0]._id }, process.env.SERVER_PASSWORD);
              return res.json({
                message: "Sign up successfully",
                token: token,
              });
            })
            .catch(next);
        }
      })
      .catch(next);
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

  isLogged(req, res, next) {
    try {
      let payLoad = "";
      const token = req.cookies.TMToken;
      if (token) {
        payLoad = jwt.verify(token, process.env.SERVER_PASSWORD);
        if (payLoad._id) {
          return res.json(true);
        }
      }
      return res.json(false);
    } catch (error) {
      return res.json(false);
    }
  }

  auth(req, res, next) {
    try {
      let payLoad = "";
      const token = req.cookies.TMToken;
      if (token) {
        payLoad = jwt.verify(token, process.env.SERVER_PASSWORD);
        if (payLoad._id) {
          req.userId = payLoad._id
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
