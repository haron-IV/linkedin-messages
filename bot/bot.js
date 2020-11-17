const { cfg: { url: { contacts }, constactPageCounter } } = require('./utils')
const logger = require('../api/logger')
const { messageLoop } = require('./messageSender')

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
  const limit = runConfig.messagesLimit > 0 ? runConfig.messagesLimit : 999
  await openContacts(page)
  for(let i =0; i <= limit; i++) {
    await messageLoop(page, runConfig)
    await nextContactsPage(page)
  }
  
}

module.exports = runBot