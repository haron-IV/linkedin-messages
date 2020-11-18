const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  type: String,
  // date: {
  //   type: Date,
  //   default: new Date
  // },
  message: String
},
{
  timestamps: true
})

const Log = mongoose.model('log', logSchema)

module.exports = Log