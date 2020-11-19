const logger = require('../api/logger')
const { addLog } = require('../api/service/logService')

const cfg = {
  url: {
    base: 'https://www.linkedin.com',
    contacts: 'https://www.linkedin.com/search/results/people/?facetNetwork=%5B%22F%22%5D&origin=CLUSTER_EXPANSION'
  },
  waitTime: process.env.ENV === 'local' ? 5000 : (60 * 1000),
  waitTImeAfterMessage: process.env.ENV === 'local' ? 5000 : (3 * 60 * 1000),
  constactPageCounter: 1
}

const closeBrowser = async (browser) => { await browser.close() }
const closePage = async (page) => { await page.close() }
const browserConfig = () => {
  const env = process.env.BROWSER_CFG
  logger.info(`Loaded ${env ? env : 'prod'} browser config`)

  const browser_cfg = {
    local: {
      headless: false
    },
    prod: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    }
  }

  if (env === 'local') return browser_cfg.local
  else return browser_cfg.prod
}

const delay = timeout => {
  return new Promise(resoolve => {
    setTimeout(resoolve(), timeout);
  })
}

const extractNameFromFullName = (fullName) => fullName?.split(',')[0] ? fullName?.split(',')[0] : null

let browser = null
const getBrowser = async () => browser
const setBrowser = async (b) => { browser = b }

let botStatus = false
const setBotStatus = (status) => botStatus = status
const getBotStatus = () => botStatus

const stopBot = async () => {
  const b = await getBrowser()
  b.browser.close()
  logger.info('Stop bot.')
  addLog({type: 'info', message: 'Bot stopped.'})
  setBotStatus(false)
}

module.exports = { 
  closeBrowser,
  closePage,
  browserConfig,
  cfg,
  delay,
  extractNameFromFullName,
  stopBot,
  setBotStatus,
  getBotStatus,
  getBrowser,
  setBrowser
}