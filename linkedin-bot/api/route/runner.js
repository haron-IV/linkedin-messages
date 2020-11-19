const express = require('express')
const router = express.Router()
const { start } = require('../../bot/index')
const { stopBot, getBotStatus } = require('../../bot/utils')

router.post('/start', async (req, res) => {
  res.status(200).json({ msg: 'Bot started' })
  const runConfig = req.body

  start(runConfig);
})

router.get('/stop', async (req, res) => {
  stopBot()
  res.status(200).json({ msg: 'Bot stopped' })
})

router.get('/status', async (req, res) => { 
  res.status(200).json({ msg: { isBotRunning: getBotStatus() } })
})

module.exports = router