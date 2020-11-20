const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
  authType: {
    type: String // user interface or cookie
  },
  key: {
    type: String
  }
}, {
  timestamps: true
})

const Auth = mongoose.model('auth', authSchema)

module.exports = Auth