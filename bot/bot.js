const { cfg: { url: { contacts } } } = require('./utils')
let { cfg: { constactPageCounter }, getContactsWithRegion } = require('./utils')
const  { stopBot } = require('./utils')
const { maxContactPages, sendMessageBtn, messageCloseBtn } = require('./elements')
const logger = require('../api/logger')
const { messageLoop, openProfile, openMessageWindow } = require('./messageSender')
const { addLog } = require('../api/service/logService')
const { getUsersToSendFollowup, markFollowmessageAsSend } = require('../api/service/userService')
const { getCounter } = require('../api/service/counterService')

const openContacts = async (page) => {
  await page.goto(contacts, { waitUntil: 'domcontentloaded' })
  logger.info('Contacts opened')
}

const nextContactsPage = async (page, limit) => {
  constactPageCounter++
  const pageLink = getContactsWithRegion()
  await page.goto(`${pageLink}&page=${constactPageCounter}`, { waitUntil: 'domcontentloaded' })
  logger.info(`Opened ${constactPageCounter}/${limit} contact page`)
}

const getMaxContactPages = async (page) => {
  await page.evaluate(() => window.scrollTo(0,document.body.scrollHeight))
  let maxPagesHandler = null
  let maxPages = null
  try {
    await page.waitForSelector(maxContactPages)
    maxPagesHandler = await page.$(maxContactPages)
    maxPages = await page.evaluate(maxPagesHandler => maxPagesHandler.textContent, maxPagesHandler)
    logger.info(`Pages ${maxPages}`)
  } catch {
    maxPages = 10
    logger.info(`Cannot load max contact pages, set default value ${maxPages}`)
    logger.info(`${maxPages} pages with contacts`)
  } finally {
    return Number(maxPages)
  }
}

const getDateForFollowup = () => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)

  return date
} 

const sendFolloups = async (page) => {
  const usersToSend = await getUsersToSendFollowup(getDateForFollowup())
  logger.info(`${usersToSend.length} followup messages to send`)
  addLog({type: 'info', message: `Follow up messages to send: ${usersToSend.length}`})

  for (const user of usersToSend) {
    if (user.followUpMessage.length > 3 && user.followupWasSend) {
      await openProfile(page, user.profileLink)
      await openMessageWindow(page)
      await page.waitFor(2000)
      await page.keyboard.type(user.followUpMessage)
      await page.click(sendMessageBtn)
      await markFollowmessageAsSend(user._id)
      await page.waitFor(3000)
      await page.click(messageCloseBtn)
      
      logger.info(`Follow up message send to: ${user.fullName}`)
      addLog({type: 'info', message: `Follow up message send to: ${user.fullName}`})
    }
  }
}

const runBot = async (browser, page, runConfig) => {
  const limit = runConfig.runConfig.messagesLimit > 0 ? runConfig.runConfig.messagesLimit : 999
  await openContacts(page)
  const contactPagesLimit = await getMaxContactPages(page)
  while(await getCounter() < limit) {
    if (constactPageCounter <= contactPagesLimit) {
      await messageLoop(page, runConfig, limit)
      await nextContactsPage(page, contactPagesLimit)
    }
  }
  
  await sendFolloups(page)

  logger.info('Work done.')
  addLog({type: 'info', message: 'Job done.'})
  stopBot()
}

module.exports = { runBot }