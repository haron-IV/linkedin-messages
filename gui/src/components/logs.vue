<template>
  <div class="logs">
    <div class="logs__wrap" id="logs" v-if="logs.length > 0">
      <div
        class="log"
        :class="log.type === 'info' ? 'log--info' : 'log--error'"
        v-for="(log, i) in logs"
        :key="i">
        {{ log.message }}
        <span>{{new Date(log.createdAt).toLocaleTimeString()}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch, ref } from '@vue/composition-api'
import { api_url }  from '@/components/utils'
import uniq from 'lodash.uniqby'

export default {
  setup(_, {root: { $store, $axios }}) {
    const logs = computed(() => $store.getters['getLogs'])
    
    watch(logs, () =>  {
      if (document.querySelector('#logs')) document.querySelector('#logs').scrollTop = -document.querySelector('#logs').scrollHeight;
    })
    
    return { logs }
  }
}
</script>

<style lang="scss">
.logs {
  width: 90%;
  display: flex;
  background-color: rgb(246, 245, 245);
  margin: 2rem 0;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  text-shadow: 2px 2px 4px #000;
  &__wrap {
    width: 100%;
    min-height: 50px;
    max-height: 350px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column-reverse;
    &::-webkit-scrollbar {
      width: 0px;
      background: transparent; /* make scrollbar transparent */
    }
   .log {
     margin: 3px 0;
     border: 1px #000 solid;
     border-width: 1px 0;
     border-radius: 3px;
     display: flex;
     justify-content: space-between;
     align-items: center;
     padding: .5rem 1rem;
     .time {
       font-weight: bold;
     }
     &--info {
       background-color: rgb(169, 231, 196);
     }
     &--error {
      background-color: rgb(237, 200, 200)
     }
   }
  }
}
</style>