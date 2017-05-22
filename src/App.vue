<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    created() {
      this.$store.commit('init')
    }
  }
</script>

<style>
  html,
  body {
    height: 100%;
  }
  
  #app {
    height: 100%;
  }
</style>