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

const filterByRegion = async (page, runConfig) => {
  const {runConfig: { regions }} = runConfig
  const region = AllRegions.filter(region => region.name === regions[0].name)[0]

  if (regions[0].name) {
    const regionLink = `${regionSearch[0]}${region.key}${regionSearch[1]}`
    setContactsWithRegion(regionLink)
    await page.goto(regionLink)
  }
}

const getUsersFromPage = async (page, runConfig) => {
  await filterByRegion(page, runConfig)
  await scrollToBottomOfThePage(page)
  const users = await mapUsers(page)
  logger.info('Users mapped')
  return users
}

const getLocalozatonObj = (localization) => {
  const loc = localization?.split(/[,.]/)
  if (loc.length > 2 && loc.length < 4) return {
    country: loc[3].trim(),
    city: loc[0].trim(),
    voivodeship: loc[2].trim()
  }
  else return { //nulls here cuz sometimes localization includes other template. Full localization assigned to voivodeship cuz bot looking for voivodeship when filtering users
    country: null,
    city: null,
    voivodeship: localization
  }
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