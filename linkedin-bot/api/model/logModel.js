const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  type: String,
  message: String
},
{
  timestamps: true
})

const Log = mongoose.model('log', logSchema)

module.exports = Log