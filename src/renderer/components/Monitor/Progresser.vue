<template>
  <div class="box is-radiusless">
    <article class="media">
      <div class="media-content">
        <div class="content">
          <p class="title is-4 has-text-primary">
            {{ displayName }}
          </p>
        </div>
        <nav class="level is-mobile">
          <div class="level-left">
            <a class="level-item">
              <span class="icon is-small" @click="toggle(downloadInfo.infoHash||progressInfo.infoHash)">
                <i v-if="downloadInfo.status==='stoped'" class="fa fa-play" aria-hidden="true"></i>
                <i v-else class="fa  fa-pause fa-play" aria-hidden="true"></i>
              </span>
            </a>
            <progress class="level-item progress is-primary is-small" :value="progress" max="100"></progress>
            <span class="level-item ">
              <strong class="has-text-primary">{{progress}}</strong>
              <span class="icon is-small has-text-primary">
                <i class="fa fa-percent" aria-hidden="true"></i>
              </span>
            </span>
            <strong class="level-item has-text-primary">{{downloaded}} / {{totalLength}}</strong>
            <template v-if="downloadInfo.status === 'downloading'">
              <strong class="level-item has-text-primary">{{numPeers}} peer(s)</strong>
              <span class="level-item">
                <span class="icon is-small has-text-primary">
                  <i class="fa fa-arrow-down" aria-hidden="true"></i>
                </span>
                <strong class="has-text-primary">{{downloadSpeed}}</strong>
                <p>&nbsp;</p>
                <span class="icon is-small has-text-primary">
                  <i class="fa fa-arrow-up" aria-hidden="true"></i>
                </span>
                <strong class="has-text-primary">{{uploadSpeed}}</strong>
              </span>
              <strong class="level-item has-text-primary">{{timeRemaining}} remaining</strong>
            </template>
          </div>
        </nav>
      </div>
    </article>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'progresser',
  props: {
    downloadInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState([
      'progressList'
    ]),
    progressInfo () {
      return this.progressList.data.find(info => info.infoHash === this.downloadInfo.infoHash)
    },
    displayName () {
      let name = this.downloadInfo.displayName
      if (!name && this.progressInfo) {
        name = this.progressInfo.displayName
      }
      if (!name && this.progressInfo && this.progressInfo.files.length > 0) {
        name = this.progressInfo.files[0].path.split('/')[0]
      }
      return name || '[Loading ...]'
    },
    downloadSpeed () {
      if (!this.progressInfo) {
        return '0 B/s'
      }
      return this.computeSpeed(this.progressInfo.downloadSpeed)
    },
    uploadSpeed () {
      if (!this.progressInfo) {
        return '0 B/s'
      }
      return this.computeSpeed(this.progressInfo.uploadSpeed)
    },
    totalLength () {
      let total = this.progressInfo && this.progressInfo.totalLength ? this.progressInfo.totalLength : this.downloadInfo.totalLength
      return this.computeLength(total)
    },
    downloaded () {
      let length = this.progressInfo && this.progressInfo.downloaded ? this.progressInfo.downloaded : this.downloadInfo.downloaded
      return this.computeLength(length)
    },
    progress () {
      let value = this.progressInfo && this.progressInfo.progress ? this.progressInfo.progress : this.downloadInfo.progress
      return (value * 100).toFixed(2)
    },
    timeRemaining () {
      if (!this.progressInfo) {
        return '99 years'
      }
      let remaining = this.progressInfo.timeRemaining
      if (remaining > 1000 * 60 * 60 * 24) {
        return (remaining / (1000 * 60 * 60 * 24)).toFixed(2) + ' day(s)'
      } else if (remaining > 1000 * 60 * 60) {
        return (remaining / (1000 * 60 * 60)).toFixed(2) + ' hour(s)'
      } else if (remaining > 1000 * 60) {
        return (remaining / (1000 * 60)).toFixed(2) + ' minute(s)'
      } else if (remaining > 1000) {
        return (remaining / (1000)).toFixed(0) + ' second(s)'
      }
      return '0 seconds'
    },
    numPeers () {
      return this.progressInfo ? this.progressInfo.numPeers : 0
    }
  },
  methods: {
    computeSpeed (speed) {
      if (!speed) {
        return '0 B/s'
      }
      if (speed > 1000000) {
        speed = (speed / 1024 / 1024).toFixed(2)
        return speed + ' MB/s'
      } else if (speed > 1000) {
        speed = (speed / 1000).toFixed(2)
        return speed + ' KB/s'
      } else {
        return speed + ' B/s'
      }
    },
    computeLength (length) {
      if (!length) {
        return '0 B'
      }
      if (length > 1000000000) {
        length = (length / 1024 / 1024 / 1024).toFixed(2)
        return length + ' GB'
      } else if (length > 1000000) {
        length = (length / 1024 / 1024).toFixed(2)
        return length + ' MB'
      } else if (length > 1000) {
        length = (length / 1000).toFixed(2)
        return length + ' KB'
      } else {
        return length + ' B'
      }
    },
    stop (infoHash) {
      this.$electron.ipcRenderer.send('stop-torrenting', infoHash)
    },
    resume (infoHash) {
      this.$electron.ipcRenderer.send('resume-torrenting', infoHash)
    },
    toggle (infoHash) {
      if (this.downloadInfo.status === 'downloading') {
        this.stop(infoHash)
      } else if (this.downloadInfo.status === 'stoped') {
        this.resume(infoHash)
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.box {
  max-height: 6.5rem;

  &:not(:last-child) {
    margin-bottom: 0.2rem;
  }

  .media-content {
    width: 100%;
  }

  .title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
  }

  progress {
    width: 3rem;
  }

  p,
  strong {
    user-select: none;
  }
}
</style>
