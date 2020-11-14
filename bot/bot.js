const { cfg: { url: { contacts } } } = require('./utils')
const { delay } = require('./utils')
const logger = require('../api/logger')

const openContacts = async (page) => {
  await page.goto(contacts, { waitUntil: 'domcontentloaded' })
  logger.info('Contacts opened')
}

const scrollToBottomOfThePage = async (page) => {
  await page.evaluate(() => window.scrollTo(0,document.body.scrollHeight))
  const time = 60 * 1000
  logger.info(`Wait ${time / (60 * 1000)} mins`)
  await page.waitFor(time)
}

const getUsers = async (page) => {
  return [...await page.$$('div div[role=main] div div ul li')]
}

const mapUsers = async (page) => {
  const users = await getUsers(page)
  const selectedUsers = []

  for (const user of users) {
    const userNameAndContactLvl = await page.evaluate(user => user?.children[0]?.children[0]?.children[1]?.children[0]?.innerText, user)
    const fullName = userNameAndContactLvl?.split(' ').slice(0, 2).join()
    const contactLvl = userNameAndContactLvl?.split(' ').slice(2, userNameAndContactLvl?.split(' ').length)[1]
    const localization = await page.evaluate(user => user?.children[0]?.children[0]?.children[1]?.children[2]?.innerText, user)
    const profileHref = await page.evaluate(user => user?.children[0]?.children[0]?.children[1]?.children[0]?.getAttribute('href'), user)
    
    if (fullName, contactLvl, localization, profileHref) {
      const userObj = {
        fullName,
        contactLvl,
        localization,
        profileHref
      }
  
      selectedUsers.push(userObj)
    }
  }
  
  return selectedUsers
}

const runBot = async (page) => {
  await openContacts(page)
  await scrollToBottomOfThePage(page)
  const users = await mapUsers(page)
  console.log(users);
}

module.exports = runBot