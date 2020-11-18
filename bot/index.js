require('dotenv').config({ path: '../.env'})
const puppeteer = require('puppeteer')
const logger = require('../api/logger')
const { browserConfig } = require('./utils')
const login = require('./login')
const { runBot } = require('./bot')

let browser = null
let botStatus = false

const getBotStatus = () => botStatus
const setBotStatus = (status) => botStatus = status

const Browser = async () => {
  const browser = await puppeteer.launch(browserConfig())
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
  await page.setViewport({ width: 1440, height: 754 })
  logger.http('Bot initialized')

  return { browser, page }
}

const openLI = async (page) => {
  await page.goto('https://linkedin.com')
  logger.http('Linkedin opened')
}

const start = async (runConfig) => {
  browser = await Browser()
  setBotStatus(true)
  await openLI(browser.page)
  await login(browser.page, runConfig)
  await runBot(browser.browser, browser.page, runConfig)
}

const stop = async () => { browser.browser.close() }

module.exports = { start, stop, getBotStatus, setBotStatus }
