<template>
  <div class="logs">
    <div class="logs__wrap" v-if="logs.length > 0">
      <div
        class="log"
        :class="getLogClass(log)"
        v-for="log in logs"
        :key="log.msg">
        {{ log.msg }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
export default {
  setup(_, {root: { $store }}) {
    const logs = computed(() => $store.getters['getLogs'])
    const getLogClass = (log) => log.type === 'info' ? 'log--info' : 'log--error'

    return { logs, getLogClass }
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
  font-size: 1.15rem;
  text-shadow: 2px 2px 4px #000;
  &__wrap {
    width: 100%;
    min-height: 150px;
    max-height: 350px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0px;
      background: transparent; /* make scrollbar transparent */
    }
   .log {
     margin: 3px 0;
     border: 1px #000 solid;
     border-width: 1px 0;
     border-radius: 3px;
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