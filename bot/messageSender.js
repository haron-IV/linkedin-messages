const logger = require('../api/logger')
const selectUserToSendMsg = require('./userTargetSelector')
const { messageWindow, openMessageBtn, sendMessageBtn } = require('./elements')
const { saveUserInfo, getUserByProfileLink } = require('../api/service/userService')
const { addLog } = require('../api/service/logService')
const { 
  cfg: { 
    url: { 
      base,
      contacts 
    },
    waitTImeAfterMessage
  } 
} = require('./utils')
const { count } = require('../api/model/logModel')

const openProfile = async (page, profileLink) => {  
  // ${base} sometimes links can be without orign
  await page.goto(`${profileLink}`, { waitUntil: 'domcontentloaded' })
  logger.info(`Profile openend -> ${profileLink}`)
}

const openMessageWindow = async (page) => {
  await page.waitFor(5000)
  await page.waitForSelector(openMessageBtn)
  await page.click(openMessageBtn)
  await page.waitForSelector(messageWindow)
  logger.info('Message window opened')
}

const sendMessage = async (page, message, user) => {
  await page.waitFor(2000)
  await page.keyboard.type(message)
  if (message.length > 3) {
    await page.waitFor(2000)
    await page.click(sendMessageBtn)
    logger.info(`Message send to: ${user.fullName}`)
    addLog({type: 'info', message: `Message send to: ${user.fullName}`})
    saveUserInfo(user)
  } else {
    logger.info(`Message to short to send.`)
  }
}

const messageLoop = async (page, runConfig, counter, limit) => { 
  logger.info(`Message loop for: ${limit} messages`)
  
  const selectedUsers = await selectUserToSendMsg(page, runConfig) // select users from actual page
  for (const user of selectedUsers) {  
    if (!await getUserByProfileLink(user.profileHref) && counter <= limit) {
      await openProfile(page, user.profileHref)
      await openMessageWindow(page)
      await sendMessage(page, runConfig.runConfig.message, user)
      counter++;
      await page.waitFor(waitTImeAfterMessage)
    } else {
      logger.info(`User ${user.fullName} already used`)
    }
  }
}

module.exports = { messageLoop }