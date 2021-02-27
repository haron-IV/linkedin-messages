<template>
  <div class="configuration">
    <section>
      <header>Konfiguracja</header>

      <div class="input-wrapper">
        <label for="gender">Wysyłaj do:</label>
        <select
          type="select"
          class=""
          id="gender"
          @input="(e) => $store.commit('setGender', e.target.value)"
        >
          <option value="null" style="display: none">wybierz pleć</option>
          <option value="male">Męzczyzn</option>
          <option value="female">Kobiet</option>
          <option value="all">Kazdego</option>
        </select>
      </div>

      <div class="input-wrapper">
        <label for="gender">Wybierz region:</label>
        <div class="regions">
          <ul class="list" :class="{ 'block-selecting': isRegionSelected }">
            <li
              class="list-item"
              :class="{ 'list-item--selected': region.selected }"
              v-for="region in $store.state.runConfig.regions"
              :key="region.name"
              @click="$store.commit('toggleRegion', region.name)"
            >
              {{ region.name }}
            </li>
          </ul>

          <div :class="{ 'selected-regions': isRegionSelected }">
            <span
              v-for="region in $store.state.runConfig.regions.filter(
                (el) => el.selected === true
              )"
              :key="region.name"
            >
              {{ region.name }},
            </span>
          </div>
        </div>
      </div>

      <div class="input-wrapper">
        <label for="message">Wiadomość</label>
        <textarea name="msg" id="message" v-model="msg"></textarea>
      </div>

      <div class="input-wrapper">
        <label for="followup-message">Wiadomość follow up</label>
        <textarea name="fmsg" id="followup-message" v-model="fmsg"></textarea>
      </div>

      <div class="input-wrapper" v-if="fmsg && fmsg.length > 3">
        <label for="followup-message-time">Kiedy wysłać follow up?</label>
        <input
          name="fmsgT"
          type="date"
          id="followup-message-time"
          :class="{ require: fmsg && fmsg.length > 3 }"
          v-model="fmsgT"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
export default {
  setup(_, { root: { $store } }) {
    const msg = computed({
      get: () => $store.state.runConfig.message,
      set: (val) => {
        $store.commit("setMessage", val);
      },
    });

    const fmsg = computed({
      get: () => $store.state.runConfig.followupMessage,
      set: (val) => {
        $store.commit("setFollowupMessage", val);
      },
    });

    const fmsgT = computed({
      get: () => $store.state.runConfig.followupMessageSendTime,
      set: (val) => $store.commit("setFollowupMessageTime", val),
    });

    const isRegionSelected = computed(() => {
      const selectedRegions = $store.state.runConfig.regions.map(
        (region) => region.selected
      );
      if (selectedRegions.filter((region) => region === true).length > 0)
        return true;
      else false;
    });

    return {
      msg,
      fmsg,
      fmsgT,
      isRegionSelected,
    };
  },
};
</script>

<style>
select {
  padding: 0.2rem;
  min-width: 200px;
}
.list {
  list-style-type: none;
  height: 30px;
  overflow: hidden;
}
.list:hover {
  height: 200px;
  overflow-y: scroll;
}
.list-item {
  cursor: pointer;
  height: 30px;
  padding: 0.3rem 0;
  border-bottom: 1px solid;
}
.list-item:hover {
  background-color: rgb(241, 241, 241);
}
.list-item--selected {
  background-color: skyblue;
}
.require {
  border: 2px solid orange;
}
textarea {
  min-width: 250px;
  min-height: 100px;
  padding: 5px;
}
input {
  padding: 5px;
}
.selected-regions {
  border: solid green;
  border-width: 0 0 2px 0;
}
.block-selecting {
  border: 2px solid green;
  pointer-events: none;
  opacity: 0;
  position: absolute;
}
</style>