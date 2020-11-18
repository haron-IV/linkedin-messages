<template>
  <div v-if="showInterface" class="container">
    <header>
      <h1>LinkedIn Message Bot</h1>
      <div>status<span :class="{'status--on': runBotState}"></span></div>
      
    </header>
    
    <login-form />
    <configuration-form />

    <button class="btn-lg" :class="runBotState ? 'btn-danger' : 'btn-success' " @click="runBot()">{{ runBotState ? 'Stop' : 'Start' }}</button>
    <logs />
  </div>
</template>

<script>
import Logs from '../components/logs.vue'
import LoginForm from '../components/login-form.vue'
import { getCookie, saveUserCred, getUserCred, getApiUrl, createLog } from '@/components/utils'
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
        $axios.post(`${getApiUrl(window)}/runner/start`, { ...user.value, runConfig: runConfig.value })
        .then(res => {
          // if(res.status === 200) {}
          // else {}
        })
        .catch(err => { console.log(err) })
      } else {
        $axios.get(`${getApiUrl(window)}/runner/stop`).then(res => { console.log(res) }) // push log
      }
      $store.commit('toggleBotStarted')
    }

    const updateInfo = () => {
      $axios.get(`${getApiUrl(window)}/update`).then( res => {
        $store.commit('setBotStarted', res.data.botStatus)
        $store.commit('updateLogs', res.data.logs)
      })
    }

    setInterval(() => {
      updateInfo()
    }, 15000);

    return { showInterface, runBot, runBotState }
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