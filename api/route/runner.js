const express = require('express')
const router = express.Router()
const { start, stop } = require('../../bot/index')
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

module.exports = router