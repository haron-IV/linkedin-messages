const express = require('express')
const router = express.Router()
const { getUsersToSendFollowup } = require('../service/userService')

router.get('/followup', async (req, res) => {
  res.status(200).json(await getUsersToSendFollowup(req.body.date))
})

module.exports = router