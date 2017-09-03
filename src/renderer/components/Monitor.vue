<template>
  <div id="monitor" @drop.prevent.stop="onDrop" @dragover.prevent.stop="onDragover" @dragleave.prevent.stop="onDragleave">
    <Progresser v-for="info in progressInfos" :key="info.infoHash" :progressInfo="info"></Progresser>
    <Launcher></Launcher>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import Progresser from './monitor/Progresser'
import Launcher from './monitor/Launcher'

export default {
  name: 'monitor',
  data () {
    return {
      listen: false,
      progressInfos: []
    }
  },
  created () {
    this.listen = true
    ipcRenderer.on('got-progress', (e, progressInfos) => {
      this.progressInfos = progressInfos
    })
    this.fecthProgress()
  },
  beforeDestroy () {
    ipcRenderer.removeAllListeners('got-progress')
    this.listen = false
  },
  methods: {
    onDragover () {
      return false
    },
    onDragleave () {
      return false
    },
    onDrop (e) {
      console.log(e.dataTransfer.getData('URL'))
      for (let f of e.dataTransfer.files) {
        console.log(f.path)
      }
      return false
    },
    fecthProgress () {
      ipcRenderer.send('fecth-progerss')
      if (this.listen) {
        setTimeout(this.fecthProgress, 1000)
      }
    }
  },
  components: {
    Progresser,
    Launcher
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
