const express = require('express')
const router = express.Router()
const { getLogs, getAllLogs } = require('../service/logService')
// const readFile = require('read-last-lines')

router.get('/', async (req, res) => {
  const logs = getLogs()
  res.status(200).json(logs)
  // readFile.read('logs/logs.log', 15).then(text => {
  //   res.status(200).json({ text })
  // })
})

router.get('/all', async (req, res) => {
  
  res.status(200).json(await getAllLogs())
})

module.exports = router