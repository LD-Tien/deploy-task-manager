const express = require("express");
var cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./config/db");
const route = require("./routes");
require("dotenv").config();

db.connect();

const app = express();
app.use(cookieParser());

// middleware bodyParse
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "app", "build")));

route(app);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "app/build", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log("Server started on port " + process.env.PORT);
});
