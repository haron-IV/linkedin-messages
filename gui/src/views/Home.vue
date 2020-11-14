<template>
  <div>
    <h1>Wprowadz kod autoryzacyjny:</h1>
    <form @submit.prevent="auth()">
      <input type="text" name="" id="" v-model="authKey">
      <input type="submit" name="" id="">
      <p class="error">
        {{info}}
      </p>
    </form>
  </div>  
</template>

<script>
import { ref, computed } from '@vue/composition-api'

export default {
  setup(_, { root: { $axios, $router } }) {
    const authKey = ref('')
    const info = ref('')

    const auth = () => {
      $axios.post('http://localhost:9090/auth', {
        authKey: authKey.value,
        type: "user"
      })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          const date = new Date()
          date.setTime(date.getTime() + (3*24*60*60*1000)) //set cookie for 3 days
          const expires = `; expires=${date.toUTCString()}`
          document.cookie = `bot_auth = true ${expires}; path=/`
          $router.push('/bot')
        }
      })
      .catch(err => {
        info.value = err.response.data.msg
      })
    }
    return { authKey, auth, info }
  }
}
</script>

<style >
  .error {
    color: rgb(190, 78, 78);
  }
</style>