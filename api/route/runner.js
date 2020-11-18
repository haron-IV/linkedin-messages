const express = require('express')
const router = express.Router()
const { start, stop, getBotStatus } = require('../../bot/index')
const logger = require('../logger')

router.post('/start', async (req, res) => {
  logger.info('Start bot.')
  res.status(200).json({ msg: 'Bot started' })
  const runConfig = req.body

  start(runConfig);
})

router.get('/stop', async (req, res) => {
  logger.http('Stop bot.')
  stop()
  res.status(200).json({ msg: 'Bot stopped' })
})

router.get('/status', async (req, res) => {
  logger.http('Get status')
  
  res.status(200).json({ msg: { isBotRunning: getBotStatus() } })
})

module.exports = router