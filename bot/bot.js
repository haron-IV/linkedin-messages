const { cfg: { url: { contacts } } } = require('./utils')
const el = require('./elements')
const logger = require('../api/logger')

const openContacts = async (page) => {
  await page.goto(contacts, { waitUntil: 'domcontentloaded' })
  logger.info('Contacts opened')
}

const getUsers = async (page) => {
  const users = await page.evaluate(() => {
    
    // const userNames = Array.from(document.querySelectorAll('div[role=main] div div ul li'), elem => elem.children[0] )
    
    return Array.from(document.querySelectorAll('div[role=main] div div ul li'), elem => elem.children[0] )
  })
  console.log(users);
  console.log(users[0].children[0].children[1].children[0]);
}

const runBot = async (page) => {
  await openContacts(page)
  await getUsers(page)
}

module.exports = runBot