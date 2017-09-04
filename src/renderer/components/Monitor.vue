<template>
  <div id="monitor" @drop.prevent.stop="onDrop" @dragover.prevent.stop="onDragover" @dragleave.prevent.stop="onDragleave">
    <Progresser v-for="info in downloadList" :key="info.infoHash" :downloadInfo="info"></Progresser>
    <Launcher></Launcher>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import Progresser from './monitor/Progresser'
import Launcher from './monitor/Launcher'

export default {
  name: 'monitor',
  data () {
    return {
      downloadList: []
    }
  },
  created () {
    this.$electron.ipcRenderer.send('download-list')
    this.$electron.ipcRenderer.on('download-list', (e, list) => {
      this.downloadList = list
    })
    this.$electron.ipcRenderer.send('start-progress')
    this.$electron.ipcRenderer.on('progress', (e, data) => {
      this.updateProgressList(data)
    })
  },
  beforeDestroy () {
    this.$electron.ipcRenderer.send('stop-progress')
    this.$electron.ipcRenderer.removeAllListeners('progress')
    this.$electron.ipcRenderer.removeAllListeners('download-list')
  },
  methods: {
    ...mapActions([
      'updateProgressList'
    ]),
    onDragover () {
      return false
    },
    onDragleave () {
      return false
    },
    onDrop (e) {
      let torrentIds = []
      const torrentFiles = Array.prototype.filter.call(e.dataTransfer.files, f => f.path.endsWith('.torrent'))
      const files = torrentFiles.map(f => f.path)
      torrentIds = torrentIds.concat(files)

      const magnetLinks = e.dataTransfer.getData('URL').split(/\s+/).filter(str => /^magnet:?[^\\"]+/.test(str))
      torrentIds = torrentIds.concat(magnetLinks)

      this.$electron.ipcRenderer.send('new-torrenting', torrentIds)
      return false
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
