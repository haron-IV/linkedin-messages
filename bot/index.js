require('dotenv').config({ path: '../.env'})
const puppeteer = require('puppeteer')
const logger = require('../api/logger')
const { browserConfig, setBotStatus, setBrowser, getBrowser } = require('./utils')
const login = require('./login')
const { runBot } = require('./bot')
const { addLog } = require('../api/service/logService')

const Browser = async () => {
  const browser = await puppeteer.launch(browserConfig())
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
  await page.setViewport({ width: 1440, height: 754 })

  return { browser, page }
}

const openLI = async (page) => {
  await page.goto('https://linkedin.com')
  logger.info('Linkedin opened')
  addLog({type: 'info', message: 'Linkedin opened.'})
}

const start = async (runConfig) => {
  try {
    logger.info('Start bot.')
    const b = await Browser()
    await setBrowser(b)
    setBotStatus(true)

    await openLI(b.page)
    await b.page.screenshot({path: `./screens/screenshot${Date.parse(new Date)}.png`});
    await login(b.page, runConfig)
    await b.page.screenshot({path: `./screens/screenshot${Date.parse(new Date)}.png`});
    const u = await b.page.url()
    logger.info(`page href: ${u}`)
    await runBot(b.browser, b.page, runConfig)
  } catch (err) {
    logger.error(err)
    addLog({type: 'error', message: 'Error bot will started again'})
  }
  
}

module.exports = { start }
