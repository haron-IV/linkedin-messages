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
    let gender = null;
    await axios.get(`https://api.genderize.io/?name=${extractNameFromFullName(fullName)}`).then(res => {
      gender = res.data.gender
      console.log(res.data.gender);
    })

    if (fullName, contactLvl, localization, profileHref) {
      const userObj = {
        fullName,
        contactLvl,
        localization,
        profileHref,
        gender
      }
  
      selectedUsers.push(userObj)
    }
  }
  
  return selectedUsers
}

const getUsersFromPage = async (page) => {
  await scrollToBottomOfThePage(page)
  const users = await mapUsers(page)
  return users
}

const selectUserToSendMsg = async (page) => {
  const users = await getUsersFromPage(page)
  console.log(users);
  // select users to send msg and return it as array
  // when array is empty return false then go to the next page
}

module.exports = selectUserToSendMsg