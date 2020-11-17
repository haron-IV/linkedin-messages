const userModel = require('../model/userModel')
const logger = require('../logger')

const saveUserInfo = async (userData) => {
  const user = new userModel(userData)

  await user.save()
  .then(() => {
    logger.info('User saved in db')
  })
  .catch(err => {
    logger.error('Cannot save user')
  })
}

module.exports = { saveUserInfo }