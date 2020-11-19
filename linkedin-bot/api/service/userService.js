const User = require('../model/userModel')
const logger = require('../logger')

const saveUserInfo = async (userData) => {
  const user = new User({...userData, profileLink: userData.profileHref})

  await user.save()
  .then(() => {
    logger.info('User saved in db')
  })
  .catch(err => {
    logger.error('Cannot save user')
  })
}

const getUserByProfileLink = async (profileLink) => {
  return await User.findOne({profileLink: profileLink})
}

module.exports = { saveUserInfo, getUserByProfileLink }