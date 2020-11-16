const fs = require('fs')
const express = require('express')
const router = express.Router()
const readFile = require('read-last-lines')

const logger = require('../logger')

router.get('/', async (req, res) => {
  logger.info('Get logs.')
  readFile.read('logs/logs.log', 15).then(text => {
    res.status(200).json({ text })
  })
})

module.exports = router