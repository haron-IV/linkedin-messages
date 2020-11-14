const authRouter = require('./route/auth')
const runnerRouter = require('./route/runner')

const registerRoutes = (app) => {
  app.use('/auth', authRouter)
  app.use('/runner', runnerRouter)
}

module.exports = registerRoutes