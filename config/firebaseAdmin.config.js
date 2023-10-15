const admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://taskmanager-8f0a1-default-rtdb.firebaseio.com",
});

module.exports = admin;
