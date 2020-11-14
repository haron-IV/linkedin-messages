const express = require('express')
const router = express.Router()
const startBot = require('../../bot/index')
const logger = require('../logger')

router.post('/start', async (req, res) => {
  logger.info('Start bot.')
  res.status(200).json({ msg: 'Bot started' })
  const runConfig = req.body

  startBot(runConfig);
})

module.exports = router