const logger = require("./logger");
const { resetCounter } = require("./service/counterService");

const server = (app) => {
  const port = process.env.API_PORT;

  app.listen(port, () => {
    logger.info(`Server is running on port: ${port}`);
    resetCounter();
  });
};

module.exports = server;
