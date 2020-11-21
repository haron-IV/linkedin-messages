const express = require('express')
const router = express.Router()
const { getUsersToSendFollowup, markFollowmessageAsSend } = require('../service/userService')

router.get('/followup', async (req, res) => {
  res.status(200).json(await getUsersToSendFollowup(req.body.date))
})

router.get('/followup-today', async (req, res) => {
  const date = new Date()
  date.setHours(25, 0, 0, 0)
  
  res.status(200).json(await getUsersToSendFollowup(date))
})

router.post('/followup-sent', async (req) => {
  await markFollowmessageAsSend(req.body.id)
})

module.exports = router