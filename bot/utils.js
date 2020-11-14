const logger = require('../api/logger')

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
const cfg = {
  url: {
    contacts: 'https://www.linkedin.com/search/results/people/?facetNetwork=%5B%22F%22%5D&origin=CLUSTER_EXPANSION'
  }
}

module.exports = { closeBrowser, closePage, browserConfig, cfg }