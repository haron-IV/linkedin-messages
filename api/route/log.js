const express = require('express')
const router = express.Router()
const { getLogs } = require('../service/logService')
// const readFile = require('read-last-lines')

router.get('/', async (req, res) => {
  const logs = getLogs()
  res.status(200).json(logs)
  // readFile.read('logs/logs.log', 15).then(text => {
  //   res.status(200).json({ text })
  // })
})

module.exports = router