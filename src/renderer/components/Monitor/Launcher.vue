<template>
  <div id="dropPanel" @click="onClick">
    <input ref="chooseFile" @change="onChange" type="file" name="torrent" accept=".torrent" multiple hidden>
    <span class="icon is-large">
      <i class="fa fa-plus"></i>
    </span>
    <p>Choose or drop torrent files here or paste magnet links</p>
  </div>
</template>

<script>
export default {
  name: 'launcher',
  methods: {
    onClick () {
      this.$refs.chooseFile.click()
    },
    onChange (e) {
      const torrentFiles = Array.prototype.filter.call(e.target.files, f => f.path.endsWith('.torrent'))
      const files = torrentFiles.map(f => f.path)
      this.$electron.ipcRenderer.send('new-torrenting', files)
    }
  }
}
</script>

<style lang="scss" scoped>
#dropPanel {
  cursor: pointer;

  flex: 1 0 6.5rem;
  background-color: $grey-lighter;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
</style>
