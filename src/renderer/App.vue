<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'snail'
}
</script>

<style lang="scss">
@import '~font-awesome/css/font-awesome.min.css';
@import '~bulma/bulma.sass';
html,
body,
#app {
  height: 100%;
  overflow: hidden;
}
</style>
