<template>
  <div ref="monitor" id="monitor" @drop.prevent.stop="onDrop" @dragover.prevent.stop="onDragover" @dragleave.prevent.stop="onDragleave">
    <Progresser :data-infohash="info.infoHash" v-for="info in downloadList" :key="info.infoHash" :downloadInfo="info"></Progresser>
    <Launcher></Launcher>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Progresser from './monitor/Progresser'
import Launcher from './monitor/Launcher'

export default {
  name: 'monitor',
  data () {
    return {
      downloadList: [],
      operateInfoHash: ''
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
  mounted () {
    this.createMenu()
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
    },
    createMenu () {
      const vm = this

      const remote = vm.$electron.remote
      const Menu = remote.Menu
      const MenuItem = remote.MenuItem
      const ipcRenderer = vm.$electron.ipcRenderer

      var menu = new Menu()
      menu.append(new MenuItem({ label: '删除任务',
        click: function () {
          console.log(vm.operateInfoHash)
          ipcRenderer.send('delete-torrent', vm.operateInfoHash)
        } }))
      menu.append(new MenuItem({ label: '删除数据',
        click: function () {

        }}))

      this.$refs.monitor.addEventListener('contextmenu', function (e) {
        e.preventDefault()
        vm.operateInfoHash = ''
        let target = e.target
        while (true) {
          let infoHash = target.dataset ? target.dataset.infohash : ''
          if (infoHash) {
            vm.operateInfoHash = infoHash
            infoHash = ''
            target = null
            break
          }
          target = target.parentNode
          if (target.nodeName === 'BODY') {
            break
          }
        }
        if (vm.operateInfoHash) {
          menu.popup(remote.getCurrentWindow())
        }
      }, false)
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
