<template>
  <div v-if="showInterface" class="container">
    <h1>LinkedIn Message Bot</h1>

    <form @submit.prevent="runBot()">
      <div class="user">
        <div class="input-wrapper">
          <label for="login">Email / numer telefonu</label>
          <input type="text" class="login" id="login" v-model="user.login">
        </div>

        <div class="input-wrapper">
          <label for="passwd">Hasło</label>
          <input type="password" class="login" id="passwd" v-model="user.password">
        </div>

        <input type="checkbox" id="remember" v-model="user.remember">
        <label for="remember">zapamiętaj</label>
      </div>

      <p class="info" v-if="runResponse.info">{{ runResponse.info }}</p>
      <p class="error" v-if="runResponse.err">{{ runResponse.err }}</p>
      <input type="submit">
    </form>
  </div>
</template>

<script>
import { getCookie, saveUserCred, getUserCred, api_url } from '@/components/utils'
import { onMounted, reactive, ref } from '@vue/composition-api'

export default {
  setup(_, { root: { $axios }}) {
    const showInterface = ref(false)
    if( getCookie()[0] === 'bot_auth=true') {
      showInterface.value = true
    }

    const user = ref({
      login: '',
      password: '',
      remember: false
    })

    const runResponse = ref({
      info: '',
      err: ''
    })

    onMounted(() => { if (getUserCred()) user.value = getUserCred() })

    const runBot = () => {
      saveUserCred(user.value)
      $axios.post(`${api_url.local}/runner/start`, {
        ...user.value
      })
      .then(res => {
        console.log(res);
        if(res.status === 200) runResponse.value.info = res.data.msg
        else runResponse.value.err = res.data.msg
        setTimeout(() => {
          runResponse.value.info = ''
          runResponse.value.err = ''
        }, 15000);
      })
      .catch(err => { runResponse.value.err = err.data.msg }
      )
    }

    return { showInterface, user, runBot, runResponse }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input-wrapper {
  margin: 1rem 0;
  display: flex;
  justify-content: space-between;
  max-width: 500px;
  min-width: 400px;
}
.info {
  color: #42b983;
}
</style>