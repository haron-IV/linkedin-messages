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
    lastApiLog: null,
    botStarted: false,
    runConfig: {
      gender: null,
      regions: [
        { name: "dolnośląskie", selected: false },
        { name: "kujawsko-pomorskie", selected: false },
        { name: "lubelskie", selected: false },
        { name: "lubuskie", selected: false },
        { name: "łódzkie", selected: false },
        { name: "małopolskie", selected: false },
        { name: "mazowieckie", selected: false },
        { name: "opolskie", selected: false },
        { name: "podkarpackie", selected: false },
        { name: "podlaskie", selected: false },
        { name: "pomorskie", selected: false },
        { name: "śląskie", selected: false },
        { name: "świętokrzyskie", selected: false },
        { name: "warmińsko-mazurskie", selected: false },
        { name: "wielkopolskie", selected: false },
        { name: "zachodniopomorskie", selected: false }
      ],
      message: "",
      followupMessage: "",
      messageCount: 0
    }
  },
  mutations: {
    setUser(state, payload) { state.user = payload },
    setLogin(state, payload) { state.user.login = payload },
    setPassword(state, payload) { state.user.password = payload },
    setRemember(state, payload) { state.user.remember = payload },
    addError(state, payload) { 
      if (payload.length >= 1) {
        state.errors = [...state.errors, ...payload]
      } else {
        state.errors.push(payload) 
      }
    },
    addLog(state, payload) { 
      if (payload.length >= 1) {
        state.logInfo = [...state.logInfo, ...payload]  
      } else {
        state.logInfo.push(payload) 
      }
    },
    updateLogs(state, payload) {
      if (payload.length >= 1) {
        state.logInfo = []
        state.logInfo = [...payload]
      } else {
        state.logInfo.push(payload) 
      }
    },
    setGender(state, payload) { state.runConfig.gender = payload },
    toggleRegion(state, regionName) { 
      const region = state.runConfig.regions.find(region => region.name === regionName)
      region.selected = !region.selected
    },
    setLastApiLog(state, payload) { state.lastApiLog = payload },
    toggleBotStarted(state) { state.botStarted = !state.botStarted },
    setMessage( state, payload) { state.runConfig.message = payload },
    setFollowupMessage(state, payload) { state.runConfig.followupMessage = payload },
    setMessageCount(state, payload) { state.runConfig.messageCount = payload }
  },
  actions: {
  },
  getters: {
    getLogs: state => state.logInfo.concat(state.errors)
  },
  modules: {
  }
})
