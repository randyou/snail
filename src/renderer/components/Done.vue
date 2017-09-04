<template>
  <table class="table is-fullwidth">
    <tbody>
      <tr v-for="row in doneList" :key="row.infoHash">
        <th></th>
        <td>
          <a title="Leicester City F.C.">{{row.displayName}}</a>
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
      doneList: []
    }
  },
  created () {
    this.$electron.ipcRenderer.send('done-list')
    this.$electron.ipcRenderer.on('done-list', (e, data) => {
      this.doneList = data
    })
  },
  beforeDestroy () {
    this.$electron.ipcRenderer.removeAllListeners('done-list')
  }
}
</script>
