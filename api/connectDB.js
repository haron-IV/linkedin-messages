const mongoose = require('mongoose')
const logger = require('./logger')

const { DB_NAME, DB_HOST } = process.env
const db_cfg = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const connectDB = () => {
  mongoose.connect(`${DB_HOST}/${DB_NAME}`, db_cfg, () => {
    logger.info(`${DB_HOST}/${DB_NAME}`)
  })
}

module.exports = connectDB