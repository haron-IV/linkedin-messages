<template>
  <div class="user">
    <div class="input-wrapper">
      <label for="login">Email / numer telefonu</label>
      <input type="text" class="login" id="login" v-model="user.login" @input="e => $store.commit('setLogin', e.target.value)">
    </div>

    <div class="input-wrapper">
      <label for="passwd">Hasło</label>
      <input type="password" class="login" id="passwd" v-model="user.password" @input="e => $store.commit('setPassword', e.target.value)">
    </div>

    <!-- not working -->
    <!-- <div class="align-right">
      <input type="checkbox" id="remember" v-model="user.remember" @input="e => $store.commit('setRemember', e.target.value)">
      <label for="remember">zapamiętaj</label>
    </div> -->
  </div>  
</template>

<script>
import { getCookie, saveUserCred, getUserCred, api_url } from '@/components/utils'
import { onMounted, reactive, ref, watch } from '@vue/composition-api'
export default {
  name: 'form-login',

  setup(_, { root: { $store } }) {
    if (getUserCred()) {
      $store.commit('setUser', getUserCred())
    }
    const user = ref($store.state.user)

    return { user }
  }
}
</script>

<style>
.align-right {
  text-align: right;
}

.input-wrapper {
  margin: 1rem 0;
  display: flex;
  justify-content: space-between;
  max-width: 500px;
  min-width: 400px;
}
</style>