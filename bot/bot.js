const { cfg: { url: { contacts } } } = require('./utils')
const el = require('./elements')
const logger = require('../api/logger')

const openContacts = async (page) => {
  await page.goto(contacts, { waitUntil: 'domcontentloaded' })
  logger.info('Contacts opened')
}

const getUsers = async (page) => [...await page.$$('div div[role=main] div div ul li')]

const mapUsers = async (page) => {
  const users = await getUsers(page)
  const selectedUsers = []

  for (const user of users) {
    const userNameAndContactLvl = await page.evaluate(user => user?.children[0]?.children[0]?.children[1]?.children[0]?.innerText, user)
    const fullName = userNameAndContactLvl?.split(' ').slice(0, 2).join()
    const contactLvl = userNameAndContactLvl?.split(' ').slice(2, userNameAndContactLvl?.split(' ').length)[1]
    const localization = await page.evaluate(user => user?.children[0]?.children[0]?.children[1]?.children[2]?.innerText, user)
    const msgButton = await page.evaluate(user => user?.children[0]?.children[0]?.children[2]?.children[0]?.children[0]?.children[0], user)
    
    const userObj = {
      fullName,
      contactLvl,
      localization,
      msgButton
    }

    selectedUsers.push(userObj)
  }
  
  return selectedUsers
}

const runBot = async (page) => {
  await openContacts(page)
  await selectUsers(page)
}

module.exports = runBot