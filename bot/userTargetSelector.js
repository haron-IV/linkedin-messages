const axios = require('axios')
const deburr = require('lodash.deburr')
const logger = require('../api/logger')
const {cfg: { waitTime }, extractNameFromFullName } = require('./utils')

const scrollToBottomOfThePage = async (page) => {
  await page.evaluate(() => window.scrollTo(0,document.body.scrollHeight))
  logger.info(`Wait ${waitTime / 1000} secunds`)
  await page.waitFor(waitTime)
}

const getUsers = async (page) => {
  return [...await page.$$('div div[role=main] div div ul li')]
}

const mapUsers = async (page) => {
  const users = await getUsers(page)
  const selectedUsers = []

  for (const user of users) {
    const userNameAndContactLvl = await page.evaluate(user => user?.children[0]?.children[0]?.children[1]?.children[0]?.innerText, user)
    const fullName = deburr(userNameAndContactLvl?.split(' ').slice(0, 2).join())
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

  for (const user of selectedUsers) {
    await axios.get(`https://api.genderize.io/?name=${extractNameFromFullName(user.fullName)}`).then(res => {
      user.gender = res.data.gender
      console.log(user);
    })
  }

  return selectedUsers
}

const getUsersFromPage = async (page) => {
  await scrollToBottomOfThePage(page)
  const users = await mapUsers(page)
  return users
}

const getLocalozatonObj = (localization) => {
  const loc = localization?.split(/[,.]/)

  return {
    country: loc[3].trim(),
    city: loc[0].trim(),
    voivodeship: loc[2].trim()
  }
}

const selectUsersToSendMsg = async (page, runConfig) => {
  const {runConfig: { gender, regions }} = runConfig
  let users = await getUsersFromPage(page)
  
  if (gender !== 'all' && gender) {
    users = users.filter(user => user.gender === gender)
    console.log('gender: ', gnder, users);
  }
  if (regions) { //TODO: check this if state
    users = users.filter(user => regions.includes(getLocalozatonObj(user.localization.voivodeship)) ? user : null )
  }

  // console.log(users);
  // select users to send msg and return it as array
  // when array is empty return false then go to the next page
}

module.exports = selectUsersToSendMsg