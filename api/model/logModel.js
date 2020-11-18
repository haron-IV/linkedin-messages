const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  type: String,
  message: String
},
{
  timestamps: true
})

logSchema.index({index: 1})

const Log = mongoose.model('log', logSchema)

module.exports = Log