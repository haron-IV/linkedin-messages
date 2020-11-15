import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      login: '',
      password: '',
      remember: false
    },
    errors: [],
    logInfo: [],
    runConfig: {
      gender: null
    }
  },
  mutations: {
    setUser(state, payload) { state.user = payload },
    setLogin(state, payload) { state.user.login = payload },
    setPassword(state, payload) { state.user.password = payload },
    setRemember(state, payload) { state.user.remember = payload },
    addError(state, payload) { state.errors.push(payload) },
    addLog(state, payload) { state.logInfo.push(payload) },
    setGender(state, payload) { state.runConfig.gender = payload }
  },
  actions: {
  },
  getters: {
    getLogs: state => state.logInfo.concat(state.errors)
  },
  modules: {
  }
})
