const authRouter = require("./route/auth");
const runnerRouter = require("./route/runner");
const logsRouter = require("./route/log");
const updateRouter = require("./route/update");
const userRouter = require("./route/user");
const counterRouter = require("./route/counter");

const registerRoutes = (app) => {
  app.use("/auth", authRouter);
  app.use("/runner", runnerRouter);
  app.use("/logs", logsRouter);
  app.use("/update", updateRouter);
  app.use("/user", userRouter);
  app.use("/counter", counterRouter);
};

module.exports = registerRoutes;
