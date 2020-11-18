const Log = require('../model/logModel')
const logger = require('../logger')

const addLog = async (logInfo) => {
  const log = new Log({...logInfo})

  await log.save()
  .then(() => {
    logger.info('Log saved in db')
  })
  .catch(err => {
    logger.error('Cannot save log')
  })
}

const getLogs = async () => Log.find({})

module.exports = { addLog, getLogs }