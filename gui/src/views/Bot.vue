<template>
  <div v-if="showInterface" class="container">
    <h1>LinkedIn Message Bot</h1>
    <login-form />
    <configuration-form />

    <button class="btn-success btn-lg" @click="runBot()">Start</button>
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

    const runBot = () => {
      saveUserCred(user.value)
      $store.commit('toggleBotStarted')
      $axios.post(`${api_url.local}/runner/start`, { ...user.value, runConfig: runConfig.value })
      .then(res => {
        if(res.status === 200) $store.commit('addLog', createLog('info', res.data.msg))
        else $store.commit('addError', createLog('error', res.data.msg))
      })
      .catch(err => { console.log(err); $store.commit('addError', createLog('error', err.data.msg)) })
    }

    return { showInterface, runBot }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.info {
  color: #42b983;
}
</style>