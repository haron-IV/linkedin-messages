const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
  authType: {
    type: String // user interface or cookie
  },
  key: {
    type: String
  },
  date: {
    type: Date,
    default: new Date()
  }
})

const Auth = mongoose.model('auth', authSchema)

module.exports = Auth