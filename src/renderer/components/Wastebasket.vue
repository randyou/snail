<template>
  <table ref="table" class="table is-fullwidth">
    <tbody>
      <tr v-for="row in deletedList" :key="row.infoHash" :data-infohash="row.infoHash">
        <th></th>
        <td>
          <a :title="row.displayName">{{row.displayName}}</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'wastebasket',
  data () {
    return {
      deletedList: [],
      operateInfoHash: ''
    }
  },
  created () {
    this.$electron.ipcRenderer.send('deleted-list')
    this.$electron.ipcRenderer.on('deleted-list', (e, data) => {
      this.deletedList = data
    })
  },
  mounted () {
    this.createMenu()
  },
  beforeDestroy () {
    this.$electron.ipcRenderer.removeAllListeners('deleted-list')
  },
  methods: {
    createMenu () {
      const vm = this

      const remote = vm.$electron.remote
      const Menu = remote.Menu
      const MenuItem = remote.MenuItem
      const ipcRenderer = vm.$electron.ipcRenderer

      var menu = new Menu()
      menu.append(new MenuItem({ label: '恢复任务',
        click: function () {
          ipcRenderer.send('resume-deleted', vm.operateInfoHash)
        } }))
      menu.append(new MenuItem({ label: '彻底删除',
        click: function () {
          ipcRenderer.send('remove-deleted', vm.operateInfoHash)
        }}))

      this.$refs.table.addEventListener('contextmenu', function (e) {
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
  }
}
</script>

<style lang="scss" scoped>
table {
  td {
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
