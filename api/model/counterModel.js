const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
  count: Number,
  name: String
},
{
  timestamps: true
})

const Counter = mongoose.model('counter', counterSchema)

module.exports = Counter