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
import { ref, computed, onMounted } from '@vue/composition-api'
import { getApiUrl, getCookie } from '@/components/utils'

export default {
  setup(_, { root: { $axios, $router } }) {
    const authKey = ref('')
    const info = ref('')

    const auth = () => {
      $axios.post(`${getApiUrl(window)}/auth`, {
        authKey: authKey.value,
        type: "user"
      })
      .then(res => {
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

    onMounted(()=>{
      let cookies = getCookie()
      cookies = cookies.map(cookie => cookie.split('='))
      for (const cookie of cookies) {
        if(cookie[0] === 'bot_auth' && JSON.parse(cookie[1]) === true) { 
          $axios.post(`${getApiUrl(window)}/auth`, {
            authKey: "from_cookie",
            type: "cookie"
          }).then(res => {
            $router.push('/bot')
          })
        }
      }
    })

    return { authKey, auth, info }
  }
}
</script>

<style >
  .error {
    color: rgb(190, 78, 78);
  }
</style>