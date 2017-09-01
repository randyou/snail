<template>
  <div id="container">
    <div id="appHeader" class="columns is-mobile">
      <div id="headerColumn" class="column">
        <Headbar>
        </Headbar>
      </div>
    </div>
    <div id="appBody" class="columns is-mobile">
      <div id="sidebar" class="column is-2">
        <Sidebar></Sidebar>
      </div>
      <div id="content" class="column">

      </div>
    </div>
  </div>
</template>

<script>
import Headbar from './Index/Headbar'
import Sidebar from './Index/Sidebar'

export default {
  name: 'index',
  components: {
    Headbar,
    Sidebar
  }
}
</script>

<style lang="scss" scoped>
#container {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;

  #appHeader {
    flex: 0 0 4rem;

    #headerColumn {
      padding-bottom: 0;
      background-color: $primary;
    }
  }

  #appBody {
    flex: 1 0 31rem;

    #sidebar {
      flex: 0 0 8.18rem;
      background-color: $dark;
    }

    #content {
      flex: 1 0 60.5rem;
    }
  }
}
</style>

