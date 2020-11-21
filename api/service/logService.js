const Log = require('../model/logModel')
const logger = require('../logger')

const addLog = async (logInfo) => {
  const log = new Log({...logInfo})

  await log.save()
  .then(() => {})
  .catch(err => {
    logger.error('Cannot save log')
  })
}

const getLogs = async () => Log.find({}).sort({_id: -1}).limit(5)
const getAllLogs = async () => await Log.find({}).sort({_id: -1})

module.exports = { addLog, getLogs, getAllLogs }