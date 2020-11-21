const logger = require('../api/logger')
const { loginInp, passwdInp, loginBtn } = require('./elements')
const { addLog } = require('../api/service/logService')

const typeLogin = async (page, login) => {
  await page.waitForSelector(loginInp)
  await page.type(loginInp, login, { delay: 25 })
}

const typePasswd = async (page, passwd) => {
  await page.waitForSelector(passwdInp)
  await page.type(passwdInp, passwd)
}

const clickLoginButton = async (page) => {
  await page.waitForSelector(loginBtn)
  await page.click(loginBtn)
}

const login = async (page, runConfig) => {
  const { login, password } = runConfig
  await typeLogin(page, login)
  await typePasswd(page, password)
  await clickLoginButton(page)
  await page.waitForNavigation()
  await checkLogin(page, runConfig)
}

const checkLogin = async (page, runConfig) => {
  const url = await page.url()
  // TODO: check it
  if (!url.includes('/feed/')) {
    logger.error('Login failed. Try to login again')
    addLog({type: 'error', message: 'Login failed. Trying to log in again. Check credentials if you will see this message again.'})
    await page.goto("https://linkedin.com", { waitUntil: 'domcontentloaded' })
    await page.waitFor(2000)
    await login(page, runConfig)
  } else {
    logger.info('User logged in.')
    addLog({type: 'info', message: 'User logged in.'})
  }
}

module.exports = { login }