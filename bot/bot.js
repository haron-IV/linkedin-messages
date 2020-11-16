const { cfg: { url: { contacts } } } = require('./utils')
const logger = require('../api/logger')
const selectUserToSendMsg = require('./userTargetSelector')

const openContacts = async (page) => {
  await page.goto(contacts, { waitUntil: 'domcontentloaded' })
  logger.http('Contacts opened')
}

const runBot = async (page, runConfig) => {
  await openContacts(page)
  await selectUserToSendMsg(page, runConfig)
}

module.exports = runBot