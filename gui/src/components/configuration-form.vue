<template>
  <div class="configuration">
    <section>
      <header>
        Konfiguracja
      </header>

      <div class="input-wrapper">
        <label for="gender">Wysyłaj do:</label>
        <select type="select" class="" id="gender" @input="e => $store.commit('setGender', e.target.value)">
          <option value="null" style="display: none">wybierz pleć</option>
          <option value="male">Męzczyzn</option>
          <option value="female">Kobiet</option>
          <option value="all">Kazdego</option>
        </select>
      </div>

      <div class="input-wrapper">
        <label for="gender">Wybierz region:</label>
        <div class="regions">
          <ul class="list">
            <li class="list-item" :class="{'list-item--selected': region.selected}" v-for="region in $store.state.runConfig.regions" :key="region.name" @click="$store.commit('selectRegion', region.name)">
              {{region.name}}
            </li>
          </ul>

          <div class="selected-regions">
            <span v-for="region in $store.state.runConfig.regions.filter(el => el.selected === true)" :key="region.name">
              {{region.name}},
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  setup() {}
}
</script>

<style>
select {
  padding: .2rem;
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
  padding: .3rem 0;
  border-bottom: 1px solid;
}
.list-item:hover {
  background-color: rgb(241, 241, 241);
}
.list-item--selected {
  background-color: skyblue;
}
</style>