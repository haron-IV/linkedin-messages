const logger = require('../api/logger')
const { addLog } = require('../api/service/logService')

const cfg = {
  url: {
    base: 'https://www.linkedin.com',
    contacts: 'https://www.linkedin.com/search/results/people/?facetNetwork=%5B%22F%22%5D&origin=CLUSTER_EXPANSION',
    regionSearch: ['https://www.linkedin.com/search/results/people/?geoUrn=["', '"]&network=["F"]&origin=FACETED_SEARCH'],
    contactsWithRegion: null
  },
  waitTime: process.env.ENV === 'local' ? 5000 : (60 * 1000),
  waitTImeAfterMessage: process.env.ENV === 'local' ? 5000 : (3 * 60 * 1000),
  constactPageCounter: 1,
  messageCounter: 0
}

const AllRegions = [
  {
    name: "dolnośląskie",
    key: "105536656",
  },
  {
    name: "kujawsko-pomorskie",
    key: "100639803"
  },
  {
    name: "lubelskie",
    key: "106528648"
  },
  {
    name: "lubuskie",
    key: "103373083"
  },
  {
    name: "łódzkie",
    key: "100000957"
  },
  {
    name: "małopolskie",
    key: "101829649"
  },
  {
    name: "mazowieckie",
    key: "102996679"
  },
  {
    name: "opolskie",
    key: "106631342"
  },
  {
    name: "podkarpackie",
    key: "100965098"
  },
  {
    name: "podlaskie",
    key: "105768489"
  },
  {
    name: "pomorskie",
    key: "106191263"
  },
  {
    name: "śląskie",
    key: "102861512"
  },
  {
    name: "świętokrzyskie",
    key: "102705850"
  },
  {
    name: "warmińsko-mazurskie",
    key: "105332856"
  },
  {
    name: "wielkopolskie",
    key: "101538629"
  },
  {
    name: "zachodniopomorskie",
    key: "101427872"
  }
]

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

const setContactsWithRegion = (link) => { cfg.url.contactsWithRegion = link }
const getContactsWithRegion = () => cfg.url.contactsWithRegion

module.exports = { 
  closeBrowser,
  closePage,
  browserConfig,
  cfg,
  AllRegions,
  delay,
  extractNameFromFullName,
  stopBot,
  setBotStatus,
  getBotStatus,
  getBrowser,
  setBrowser,
  setContactsWithRegion,
  getContactsWithRegion
}