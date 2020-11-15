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
    </section>
    
  </div>
</template>

<script>
export default {

}
</script>

<style>
select {
  padding: .2rem;
  min-width: 200px;
}
</style>