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
  if (url.includes('challenge')) {
    const forms = await page.$$('form')
    logger.info(`Forms ${forms.length}`)
    forms.forEach(form => {
      const htmlF = await page.evaluate(form, form.innerHtml, form)  
      logger.info(`${htmlF}`)
    });
  }
    
    // const passwords = await page.$$('input[type=password]')

    logger.info(`forms : ${forms.length} | passwords inputs: ${passwords.length}`)
  }
}

module.exports = { login, checkLogin }