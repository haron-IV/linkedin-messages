const Counter = require('../model/counterModel')

const getCounter = async () => {
  const counter = await Counter.findOne({ name: 'users' })

  return counter.count
}

const increaseCounter = async () => {
  const actualState = await getCounter()
  const nextState = actualState + 1
  await Counter.updateOne({ name: 'users' }, { count: nextState })
}

const resetCounter = async () => {
  await Counter.updateOne({ name: 'users' }, { count: 0 })
}

module.exports = { getCounter, increaseCounter, resetCounter }