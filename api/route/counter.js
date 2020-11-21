const express = require('express')
const router = express.Router()
const { getCounter, increaseCounter } = require('../service/counterService')
const Counter = require('../model/counterModel')

router.get('/', async (req, res) => {
  res.status(200).json( await getCounter() )
})

router.post('/set', async (req, res) => {
  const counter = new Counter({
    name: 'users',
    count: 0
  })

  await counter.save().then( async msg => {
    res.status(200).json( await getCounter() )
  })
})

router.post('/increase', async (req, res) => {
  await increaseCounter()
})

module.exports = router