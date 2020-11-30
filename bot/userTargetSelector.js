const axios = require('axios')
const deburr = require('lodash.deburr')
const logger = require('../api/logger')
const {cfg: { waitTime, url: { regionSearch } }, extractNameFromFullName, AllRegions, setContactsWithRegion } = require('./utils')
const { addLog } = require('../api/service/logService')

const scrollToBottomOfThePage = async (page) => {
  await page.evaluate(() => window.scrollTo(0,document.body.scrollHeight))
  logger.info(`Wait ${waitTime / 1000} secunds`)
  await page.waitFor(waitTime)
}

const getUsers = async (page) => {
  return [...await page.$$('div div[role=main] ul li')]
}

const mapUsers = async (page) => {
  const users = await getUsers(page)
  logger.info(`users before map: ${users.length}`)
  const selectedUsers = []

  for (const user of users) {
    //TODO: refactorize selecting element
    const userNameAndContactLvl = await page.evaluate(user => user?.children[0]?.children[0]?.children[0]?.children[1]?.children[0]?.children[0]?.children[0]?.innerText, user)
    const fullName = deburr(userNameAndContactLvl?.split(' ').slice(0, 2).join())
    const contactLvl = userNameAndContactLvl?.split(' ').slice(2, userNameAndContactLvl?.split(' ').length)[1]
    const localization = await page.evaluate(user => user?.children[0]?.children[0]?.children[0]?.children[1]?.children[0]?.children[0]?.children[1]?.children[1]?.innerText, user)
    const profileHref = await page.evaluate(user => user?.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.children[0].getAttribute('href'), user)
    // console.log('------------------------------------------------------')
    // console.log(fullName, contactLvl, localization, profileHref)
    // console.log('------------------------------------------------------')
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

  for (const user of selectedUsers) {
    await axios.get(`https://api.genderize.io/?name=${extractNameFromFullName(user.fullName)}`).then(res => {
      user.gender = res.data.gender
    }).catch(err => { console.log(err)})
  }

  logger.info(`users after map: ${selectedUsers.length}`)

  return selectedUsers
}

const getUsersFromPage = async (page, runConfig) => {
  // await filterByRegion(page, runConfig)
  await scrollToBottomOfThePage(page)
  const users = await mapUsers(page)
  logger.info('Users mapped')
  return users
}

const selectUsersToSendMsg = async (page, runConfig) => {
  const {runConfig: { gender }} = runConfig
  let users = await getUsersFromPage(page, runConfig)
  logger.info(`Users before filtering ${users.length}`)

  if (gender && gender !== 'all') {
    users = users.filter(user => user.gender === gender)
    logger.info(`Users after gender filtering: ${users.length}`)
  } else {
    logger.info(`Users selected from page ${users.length}`)
  }
  
  return users
}

module.exports = selectUsersToSendMsg