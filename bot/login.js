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
  logger.info('User logged in.')
  addLog({type: 'info', message: 'User logged in.'})
}

const checkLogin = async (page) => {
  const url = await page.url()
  logger.info(`Page: ${url}`)
  // if (url.includes('challenge')) {
    const forms = await page.$$('form')
    console.log(`Forms ${forms.length}`)
    // for(const form of forms) {
    //   // const form = forms[0]
    //   const htmlF = await page.evaluate(form, form.innerHTML, form)  
    //   logger.info(`${htmlF}`)
      const tt1 = await page.$('form:nth-child(1)')
      const tt2 = await page.$$('form:nth-child(2)')
      const el1 = await page.evaluate(tt1 => tt1.innerHTML, tt1)
      const el2 = await page.evaluate(tt2 => tt2.innerHTML, tt2)
      logger.info(el1)
      logger.info(el2)
    // }
  // }
    
    // const passwords = await page.$$('input[type=password]')

    // logger.info(`forms : ${forms.length} | passwords inputs: ${passwords.length}`)
}

module.exports = { login, checkLogin }