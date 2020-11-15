require('dotenv').config({ path: '../.env'})
const puppeteer = require('puppeteer')
const logger = require('../api/logger')
const { browserConfig } = require('./utils')
const login = require('./login')
const runBot = require('./bot')

const Browser = async () => {
  const browser = await puppeteer.launch(browserConfig())
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
  await page.setViewport({ width: 1440, height: 754 })
  logger.info('Bot initialized')

  return { browser, page }
}

const openLI = async (page) => {
  await page.goto('https://linkedin.com')
  logger.info('Linkedin opened')
}

const start = async (runConfig) => {
  const { browser, page } = await Browser()
  
  await openLI(page)
  await login(page, runConfig)
  await runBot(page, runConfig)
}

module.exports = start
