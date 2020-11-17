const logger = require('../api/logger')
const selectUserToSendMsg = require('./userTargetSelector')
const { messageWindow, openMessageBtn, sendMessageBtn } = require('./elements')
const { saveUserInfo } = require('../api/service/userService')
const { 
  cfg: { 
    url: { 
      base,
      contacts 
    },
    waitTImeAfterMessage
  } 
} = require('./utils')

const openProfile = async (page, profileLink) => { 
  logger.info(`Profile openend -> ${profileLink}`)
  // ${base} sometimes links can be without orign
  await page.goto(`${profileLink}`, { waitUntil: 'domcontentloaded' }) 
}

const openMessageWindow = async (page) => {
  await page.click(openMessageBtn)
  await page.waitForSelector(messageWindow)
  logger.info('Message window opened')
}

const sendMessage = async (page, message, user) => {
  await page.keyboard.type(message)
  // await page.click(sendMessageBtn) //TODO: uncomment this for production
  logger.http(`Message send to: ${user.fullName}`)
  saveUserInfo(user)
}

const messageLoop = async (page, runConfig, counter) => { 
  logger.info('Message loop')
  
  const selectedUsers = await selectUserToSendMsg(page, runConfig) // select users from actual page
  for (const user of selectedUsers) {
    await openProfile(page, user.profileHref)
    await openMessageWindow(page)
    await sendMessage(page, runConfig.runConfig.message, user)
    counter++;
    await page.waitFor(waitTImeAfterMessage)
  }
}

module.exports = { messageLoop }