const User = require('../model/userModel')
const logger = require('../logger')

const saveUserInfo = async (userData) => {
  const user = new User({ ...userData, profileLink: userData.profileHref })

  await user.save()
  .then(() => {
    logger.info('User saved in db')
  })
  .catch(err => {
    logger.error('Cannot save user')
  })
}

const getUserByProfileLink = async (profileLink) => {
  return await User.findOne({ profileLink: profileLink })
}

const getUsersByProfileLinks = async (profileLinks) => {
  const users = await User.find({ profileLink: { $in: profileLinks } })
  return users
}

const getUsersToSendFollowup = async (date) => {
  const users = await User.find({ followupWasSend: false, followupMessageSendTime: { $gte: new Date(2019, 1, 1), $lt: new Date(date) } })
  
  return users
  // return await User.find({ followupMessageSendTime: new Date(date) })
}

const markFollowmessageAsSend = async (id) => {
  await User.updateOne({ _id: id }, { followupWasSend: true })
}

module.exports = { saveUserInfo, getUserByProfileLink, getUsersToSendFollowup, markFollowmessageAsSend, getUsersByProfileLinks }