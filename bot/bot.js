const { cfg: { url: { contacts }, constactPageCounter } } = require('./utils')
const logger = require('../api/logger')
const selectUserToSendMsg = require('./userTargetSelector')

const openContacts = async (page) => {
  await page.goto(contacts, { waitUntil: 'domcontentloaded' })
  logger.http('Contacts opened')
}

const nextContactsPage = async (page) => {
  constactPageCounter++
  await page.goto(`${contacts}&page=${constactPageCounter}`, { waitUntil: 'domcontentloaded' })
  logger.http(`Opened ${constactPageCounter} contact page`)
}

const runBot = async (page, runConfig) => {
  await openContacts(page)
  const selectedUsers = await selectUserToSendMsg(page, runConfig)
}

module.exports = runBot