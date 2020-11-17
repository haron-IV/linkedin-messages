const logger = require('../api/logger')
const selectUserToSendMsg = require('./userTargetSelector')
const { messageWindow, openMessageBtn, sendMessageBtn } = require('./elements')
const { 
  cfg: { 
    url: { 
      base,
      contacts 
    }, 
    constactPageCounter 
  } 
} = require('./utils')
let { sendMessageCount } = require('./bot')

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

const sendMessage = async (page, message) => {
  await page.keyboard.type(message)
  await page.click(sendMessageBtn)
  logger.http(`Message send to: `) // ${user}
  //TODO: add user to db
}

const messageLoop = async (page, runConfig) => {
  const { message, followupMessage } = runConfig
  logger.info('Message loop')
  //loop pages
  const selectedUsers = await selectUserToSendMsg(page, runConfig) // select users from actual page
  for (const user of selectedUsers) {
    console.log(user);
    await openProfile(page, user.profileHref)
    await openMessageWindow(page)
    await sendMessage(page, message)
    sendMessageCount.i++
  }

  //after message loop check followup
}

module.exports = { messageLoop }