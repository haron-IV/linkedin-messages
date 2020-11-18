const { cfg: { url: { contacts } } } = require('./utils')
let { cfg: { constactPageCounter } } = require('./utils')
const  { stopBot } = require('./utils')
const { maxContactPages } = require('./elements')
const logger = require('../api/logger')
const { messageLoop } = require('./messageSender')
let counter = 0

const openContacts = async (page) => {
  await page.goto(contacts, { waitUntil: 'domcontentloaded' })
  logger.http('Contacts opened')
}

const nextContactsPage = async (page, limit) => {
  constactPageCounter++
  await page.goto(`${contacts}&page=${constactPageCounter}`, { waitUntil: 'domcontentloaded' })
  logger.http(`Opened ${constactPageCounter}/${limit} contact page`)
}

const getMaxContactPages = async (page) => {
  await page.evaluate(() => window.scrollTo(0,document.body.scrollHeight))
  await page.waitForSelector(maxContactPages)
  const maxPagesHandler = await page.$(maxContactPages)
  const maxPages = await page.evaluate(maxPagesHandler => maxPagesHandler.textContent, maxPagesHandler)
  logger.http(`${maxPages} pages with contacts`)
  return Number(maxPages)
}

const runBot = async (browser, page, runConfig) => {
  const limit = runConfig.messagesLimit > 0 ? runConfig.messagesLimit : 999
  await openContacts(page)
  const contactPagesLimit = await getMaxContactPages(page)

  while(counter <= limit && constactPageCounter < contactPagesLimit) { // if limit will reach or users list will end 
    await messageLoop(page, runConfig, counter)
    await nextContactsPage(page, contactPagesLimit)
  }
  
  //TODO: followup
  logger.http('Done.')
  stopBot()
}

module.exports = { runBot }