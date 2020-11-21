import Vue from 'vue'
import Vuex from 'vuex'
import uniqBy from 'lodash.uniqby'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      login: '',
      password: '',
      remember: false
    },
    logs: [],
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
      followupMessageSendTime: 0,
      messagesLimit: 0
    }
  },
  mutations: {
    setUser(state, payload) { state.user = payload },
    setLogin(state, payload) { state.user.login = payload },
    setPassword(state, payload) { state.user.password = payload },
    setRemember(state, payload) { state.user.remember = payload },
    setGender(state, payload) { state.runConfig.gender = payload },
    toggleRegion(state, regionName) { 
      const region = state.runConfig.regions.find(region => region.name === regionName)
      region.selected = !region.selected
    },
    setLastApiLog(state, payload) { state.lastApiLog = payload },
    toggleBotStarted(state) { state.botStarted = !state.botStarted },
    setBotStarted(state, payload) { state.botStarted = payload },
    setMessage( state, payload) { state.runConfig.message = payload },
    setFollowupMessage(state, payload) { state.runConfig.followupMessage = payload },
    setFollowupMessageTime(state, payload) { state.runConfig.followupMessageSendTime = payload },
    setMessagesLimit(state, payload) { state.runConfig.messagesLimit = Number(payload) },
    updateLogs(state, payload) {
      if (state.logs.length <= 1) {
        state.logs = payload
      } else {
        const updatedLogs = uniqBy([...state.logs, ...payload], '_id')
        state.logs = updatedLogs.sort((a, b) => {
          const dateA = new Date(a.createdAt)
          const dateB = new Date(b.createdAt)

          return dateA - dateB
        })
      }
    }
  },
  actions: {},
  getters: {
    getLogs: (state) => state.logs.map(log => {
      log.date = new Date(log.date)
      return log
    })
  },
  modules: {}
})
