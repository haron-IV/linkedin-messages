const api_url = {
  local: 'http://localhost:9090'
} 

const getCookie = () => document.cookie.split(';')
const saveUserCred = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}
const getUserCred = () => JSON.parse(localStorage.getItem('user'))

export { getCookie, saveUserCred, getUserCred, api_url }