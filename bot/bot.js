const { cfg: { url: { contacts } } } = require('./utils')
let { cfg: { constactPageCounter } } = require('./utils')
const  { stopBot } = require('./utils')
const { maxContactPages } = require('./elements')
const logger = require('../api/logger')
const { messageLoop } = require('./messageSender')
const { addLog } = require('../api/service/logService')
let counter = 0

const openContacts = async (page) => {
  await page.goto(contacts, { waitUntil: 'domcontentloaded' })
  logger.info('Contacts opened')
}

const nextContactsPage = async (page, limit) => {
  constactPageCounter++
  await page.goto(`${contacts}&page=${constactPageCounter}`, { waitUntil: 'domcontentloaded' })
  logger.info(`Opened ${constactPageCounter}/${limit} contact page`)
  addLog({type: 'info', message: `Opened ${constactPageCounter}/${limit} contact page`})
}

const getMaxContactPages = async (page) => {
  await page.evaluate(() => window.scrollTo(0,document.body.scrollHeight))
  let maxPagesHandler = null
  const maxPages = null
  try {
    await page.waitForSelector(maxContactPages)
    maxPagesHandler = await page.$(maxContactPages)
    maxPages = await page.evaluate(maxPagesHandler => maxPagesHandler.textContent, maxPagesHandler)
    logger.info(`Pages ${maxPages}`)
  } catch {
    maxPages = 10
    logger.info(`Cannot load max contact pages, set default value ${maxPages}`)
    logger.info(`${maxPages} pages with contacts`)
    return Number(maxPages)
  }
}

const runBot = async (browser, page, runConfig) => {
  const limit = runConfig.messagesLimit > 0 ? runConfig.messagesLimit : 999
  await openContacts(page)
  logger.info('step 1')
  const contactPagesLimit = await getMaxContactPages(page)
  logger.info('step 2')
  while(counter <= limit && constactPageCounter < contactPagesLimit) { // if limit will reach or users list will end 
    logger.info('step 3')
    await messageLoop(page, runConfig, counter, limit)
    await nextContactsPage(page, contactPagesLimit)
  }
  
  //TODO: followup
  logger.info('Work done.')
  addLog({type: 'info', message: 'Job done.'})
  stopBot()
}

module.exports = { runBot }