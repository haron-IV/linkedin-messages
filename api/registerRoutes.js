const authRouter = require('./route/auth')
const runnerRouter = require('./route/runner')
const logsRouter = require('./route/log')

const registerRoutes = (app) => {
  app.use('/auth', authRouter)
  app.use('/runner', runnerRouter)
  app.use('/logs', logsRouter)
}

module.exports = registerRoutes