const tasksRouter = require("./tasks");
const listsRouter = require("./lists");

function route(app) {
  app.use(tasksRouter);
  app.use(listsRouter);
}

module.exports = route;
