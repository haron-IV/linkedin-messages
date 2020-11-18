<template>
  <div v-if="showInterface" class="container">
    <header>
      <h1>LinkedIn Message Bot</h1>
      <div>status<span :class="{'status--on': botStatus}"></span></div>
      
    </header>
    
    <login-form />
    <configuration-form />

    <button class="btn-lg" :class="runBotState ? 'btn-danger' : 'btn-success'" @click="runBot()">{{ runBotState ? 'Stop' : 'Start' }}</button>
    <logs />
  </div>
</template>

<script>
import Logs from '../components/logs.vue'
import LoginForm from '../components/login-form.vue'
import { getCookie, saveUserCred, getUserCred, api_url, createLog } from '@/components/utils'
import { computed, onMounted, reactive, ref } from '@vue/composition-api'
import ConfigurationForm from '../components/configuration-form.vue'

export default {
  components: {
    LoginForm, Logs,
    ConfigurationForm
  },
  setup(_, { root: { $axios, $store }} ) {
    const showInterface = ref(false)
    if( getCookie()[0] === 'bot_auth=true') {
      showInterface.value = true
    }

    const user = computed(() => $store.state.user )
    const runConfig = computed(() => {
      const cfg = $store.state.runConfig
      cfg.regions = cfg.regions.filter(region => region.selected === true)
      
      return cfg
    })
    const runBotState = computed(() => $store.state.botStarted)
    const runBot = () => {
      saveUserCred(user.value)
      if(!runBotState.value) {
        $axios.post(`${api_url.local}/runner/start`, { ...user.value, runConfig: runConfig.value })
        .then(res => {
          if(res.status === 200) $store.commit('addLog', createLog('info', res.data.msg))
          else $store.commit('addError', createLog('error', res.data.msg))
        })
        .catch(err => { console.log(err); $store.commit('addError', createLog('error', err.data.msg)) })
      } else {
        $axios.get(`${api_url.local}/runner/stop`).then(res => { console.log(res);}) // push log
      }
      $store.commit('toggleBotStarted')
    }

    const botStatus = ref(false)
    const getBotStatus = () => {
      $axios.get(`${api_url.local}/runner/status`).then(res => {
        botStatus.value = res.data.msg.isBotRunning
      })
    }

    setInterval(() => {
      getBotStatus()  
    }, 5000);

    return { showInterface, runBot, runBotState, botStatus }
  }
}
</script>

<style>
header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
header div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.status--on {
  background-color: springgreen;
}
header div span {
  width: 20px;
  height: 20px;
  display: block;
  background-color: red;
  border-radius: 50%;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.info {
  color: #42b983;
}
</style>