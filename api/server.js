const logger = require('./logger')

const server = (app) => {
  const port = process.env.API_PORT

  app.listen(port, () => {
    logger.info(`Server is running on port: ${port}`)
  })
}

module.exports = server 