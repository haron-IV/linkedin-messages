const express = require('express')
const router = express.Router()
const { getBotStatus } = require('../../bot/utils')
const { getLogs } = require('../service/logService')

router.get('/', async (req, res) => {
  const logs = await getLogs()
  await res.status(200).json({ botStatus: getBotStatus(), logs } )  
})

module.exports = router