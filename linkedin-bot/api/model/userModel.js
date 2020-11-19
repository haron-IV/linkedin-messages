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
  }
}, {
  timestamps: true
})

const User = mongoose.model('user', userSchema)

module.exports = User