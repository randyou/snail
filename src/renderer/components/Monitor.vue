<template>
  <div ref="monitor" id="monitor" @drop.prevent.stop="onDrop" @dragover.prevent.stop="onDragover" @dragleave.prevent.stop="onDragleave">
    <Progresser :data-infohash="info.infoHash" v-for="info in downloadList" :key="info.infoHash" :downloadInfo="info" @dblclick.native="toggleStatus(info)"></Progresser>
    <Launcher></Launcher>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Progresser from './Monitor/Progresser'
import Launcher from './Monitor/Launcher'

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
    this.$electron.ipcRenderer.on('existed-torrent', (e, status) => {
      let msg = '任务已经存在，将自动继续下载。'
      switch (status) {
        case 'deleted':
          msg = '废纸篓中发现相同任务，将自动恢复为下载状态。'
          break
        case 'done':
          msg = '发现已完成的相同任务，将自动恢复为下载状态。'
          break
        default:
          break
      }
      this.$electron.remote.dialog.showMessageBox(this.$electron.remote.getCurrentWindow(), {
        title: 'Info',
        message: msg,
        buttons: ['ok'],
        defaultId: 0
      })
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
          ipcRenderer.send('delete-torrent', vm.operateInfoHash)
        } }))
      menu.append(new MenuItem({ label: '彻底删除',
        click: function () {
          ipcRenderer.send('remove-torrent', vm.operateInfoHash)
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
    },
    stop (infoHash) {
      this.$electron.ipcRenderer.send('stop-torrenting', infoHash)
    },
    resume (infoHash) {
      this.$electron.ipcRenderer.send('resume-torrenting', infoHash)
    },
    toggleStatus (state) {
      if (state.status === 'downloading') {
        this.stop(state.infoHash)
      } else if (state.status === 'stoped') {
        this.resume(state.infoHash)
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
