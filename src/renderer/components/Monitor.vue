<template>
  <div id="monitor" @drop.prevent.stop="onDrop" @dragover.prevent.stop="onDragover" @dragleave.prevent.stop="onDragleave">
    <Progresser></Progresser>
    <Launcher></Launcher>
  </div>
</template>

<script>
import Progresser from './monitor/Progresser'
import Launcher from './monitor/Launcher'

export default {
  name: 'monitor',
  components: {
    Progresser,
    Launcher
  },
  methods: {
    onDragover () {
      return false
    },
    onDragleave () {
      return false
    },
    onDrop (e) {
      for (let f of e.dataTransfer.files) {
        console.log(f.path)
      }
      return false
    }
  }
}
</script>


<style lang="scss" scoped>
#monitor {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
}
</style>
