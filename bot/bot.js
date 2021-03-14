const {
  cfg: {
    url: { contacts },
  },
} = require('./utils')
let {
  cfg: {
    constactPageCounter,
    url: { regionSearch },
  },
  getContactsWithRegion,
  setContactsWithRegion,
  AllRegions,
} = require('./utils')
const { maxContactPages, sendMessageBtn, messageCloseBtn } = require('./elements')
const logger = require('../api/logger')
const { messageLoop, openProfile, openMessageWindow, checkIfUserAnswered } = require('./messageSender')
const { addLog } = require('../api/service/logService')
const { getUsersToSendFollowup, markFollowmessageAsSend } = require('../api/service/userService')

const openContacts = async page => {
  await page.goto(contacts, { waitUntil: 'domcontentloaded' })
  logger.info('Contacts opened')
}

const nextContactsPage = async (page, limit) => {
  constactPageCounter++
  const pageLink = getContactsWithRegion()
  if (pageLink) {
    await page.goto(`${pageLink}&page=${constactPageCounter}`, { waitUntil: 'domcontentloaded' })
  } else {
    await page.goto(`${contacts}&page=${constactPageCounter}`, { waitUntil: 'domcontentloaded' })
  }

  logger.info(`Opened ${constactPageCounter}/${limit} contact page`)
}

const getMaxContactPages = async page => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  let maxPagesHandler = null
  let maxPages = null
  try {
    await page.waitForSelector(maxContactPages)
    maxPagesHandler = await page.$(maxContactPages)
    maxPages = await page.evaluate(maxPagesHandler => maxPagesHandler.textContent, maxPagesHandler)
    logger.info(`Pages ${maxPages}`)
  } catch {
    maxPages = 1
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

const sendFolloups = async (page, profileName) => {
  const usersToSend = await getUsersToSendFollowup(getDateForFollowup())
  logger.info(`${usersToSend.length} followup messages to send`)
  addLog({ type: 'info', message: `Follow up messages to send: ${usersToSend.length}` })

  for (const user of usersToSend) {
    if (user.followUpMessage.length > 3 && !user.followupWasSend) {
      await openProfile(page, user.profileLink)
      await openMessageWindow(page)
      if (!(await checkIfUserAnswered(page, profileName))) {
        await page.waitFor(2000)
        await page.keyboard.type(user.followUpMessage)
        await page.click(sendMessageBtn)
        await markFollowmessageAsSend(user._id)
        await page.waitFor(3000)
        await page.click(messageCloseBtn)
        logger.info(`Follow up message send to: ${user.fullName}`)
        addLog({ type: 'info', message: `Follow up message send to: ${user.fullName}` })
      } else {
        logger.info(`Follow up message already sent to: ${user.fullName}`)
      }
    }
  }
}

const filterByRegion = async (page, runConfig) => {
  const {
    runConfig: { regions },
  } = runConfig
  const region = AllRegions.filter(region => region.name === regions[0].name)[0]

  if (regions[0].name) {
    const regionLink = `${regionSearch[0]}${region.key}${regionSearch[1]}`
    setContactsWithRegion(regionLink)
    await page.goto(regionLink)
  }
}

const runBot = async (browser, page, runConfig, profileName) => {
  // TODO: get name of your profile
  await sendFolloups(page, profileName)

  await filterByRegion(page, runConfig)
  if (!getContactsWithRegion()) {
    await openContacts(page)
  }

  const contactPagesLimit = await getMaxContactPages(page)
  while (true) {
    if (constactPageCounter <= contactPagesLimit) {
      console.log('dupa 0')
      await messageLoop(page, runConfig, 999, profileName)
      await nextContactsPage(page, contactPagesLimit)
    }
  }
}

module.exports = { runBot }
