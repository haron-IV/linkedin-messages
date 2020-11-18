const api_url = {
  local: 'http://localhost:9090',
  prod: 'http://96231f4c7749.ngrok.io'
}

const getApiUrl = (window) => window.location.href.includes('localhost') ? api_url.local : api_url.prod

const getCookie = () => document.cookie.split(';')
const saveUserCred = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}
const getUserCred = () => JSON.parse(localStorage.getItem('user'))
const createLog = ( type, msg ) => {
  const d = new Date()

  return {
    type,
    msg,
    time: `${d.toLocaleDateString().split('.')[2]}-${d.toLocaleDateString().split('.')[1]}-${d.toLocaleDateString().split('.')[0]} ( ${d.toLocaleTimeString()} )`
  }
}

export { getCookie, saveUserCred, getUserCred, api_url, createLog, getApiUrl }