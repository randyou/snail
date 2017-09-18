<template>
  <table ref="table" class="table is-fullwidth">
    <tbody>
      <tr v-for="row in doneList" :key="row.infoHash" :data-infohash="row.infoHash">
        <th></th>
        <td>
          <a :title="row.displayName">{{row.displayName}}</a>
        </td>
        <td>
          <a class="icon is-small">
            <i v-if="true" class="fa fa-play-circle" aria-hidden="true"></i>
            <i v-else class="fa fa-file" aria-hidden="true"></i>
          </a>
        </td>
        <td>
          <a class="icon is-small">
            <i class="fa fa-folder-open" aria-hidden="true"></i>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script>
export default {
  name: 'done',
  data () {
    return {
      doneList: [],
      operateInfoHash: ''
    }
  },
  created () {
    this.$electron.ipcRenderer.send('done-list')
    this.$electron.ipcRenderer.on('done-list', (e, data) => {
      this.doneList = data
    })
  },
  mounted () {
    this.createMenu()
  },
  beforeDestroy () {
    this.$electron.ipcRenderer.removeAllListeners('done-list')
  },
  methods: {
    createMenu () {
      const vm = this

      const remote = vm.$electron.remote
      const Menu = remote.Menu
      const MenuItem = remote.MenuItem
      const ipcRenderer = vm.$electron.ipcRenderer

      var menu = new Menu()
      menu.append(new MenuItem({ label: '删除任务',
        click: function () {
          ipcRenderer.send('delete-done', vm.operateInfoHash)
        } }))
      menu.append(new MenuItem({ label: '彻底删除',
        click: function () {
          ipcRenderer.send('remove-done', vm.operateInfoHash)
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
