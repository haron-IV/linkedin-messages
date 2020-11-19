const express = require('express')
const router = express.Router()
const authModel = require('../model/authModel')
const logger = require('../logger')

router.post('/', async (req, res) => {
  if (req.body.authKey === process.env.API_AUTH_KEY) {
    const auth = new authModel({
      authType: req.body.type,
      key: req.body.authKey
    })

    await auth.save()
    .then(() => {
      logger.info("Authorized to API")
      res.status(200).json({ msg: 'Authorized.' })
    })
    .catch(err => {
      if (err) { 
        logger.error(err)
        res.status(500).json({ msg: 'Error', ...err })
      }
    })
  } else {
    logger.error('Wrong auth key.')
    res.status(500).json({ msg: 'Wrgong auth key' })
  }
})

module.exports = router