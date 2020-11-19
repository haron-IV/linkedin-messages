const mongoose = require('mongoose')
const logger = require('./logger')

const { DB_NAME } = process.env
const db_cfg = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const connectDB = () => {
  mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, db_cfg, () => {
    logger.info('Db connected')
  })
}

module.exports = connectDB