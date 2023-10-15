const admin = require("../../config/firebaseAdmin.config");

class Middlewares {
  async userVerify(req, res, next) {
    const token = req.headers.authorization;
    try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
        req.userId = decodeValue.uid;
        return next();
      }
    } catch (error) {
      return res.redirect("/login");
    }
  }
}

module.exports = new Middlewares();
