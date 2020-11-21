const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String
  },
  contactLvl: {
    type: String
  },
  localization: {
    type: String
  },
  profileLink: {
    type: String
  },
  gender: {
    type: String
  },
  followUpMessage: {
    type: String
  },
  followupMessageSendTime: {
    type: Date
  },
  followupWasSend: Boolean
}, {
  timestamps: true
})

const User = mongoose.model('user', userSchema)

module.exports = User