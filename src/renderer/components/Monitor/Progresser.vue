<template>
  <div class="box is-radiusless">
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
        </figure>
      </div>
      <div class="media-content">
        <div class="content">
          <p class="title is-4 has-text-primary">
            {{filename}}
          </p>
        </div>
        <nav class="level is-mobile">
          <div class="level-left">
            <a class="level-item">
              <span class="icon is-small">
                <i class="fa fa-pause" aria-hidden="true"></i>
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
            <strong class="level-item has-text-primary">{{progressInfo.numPeers}} peer(s)</strong>
            <span class="level-item">
              <span class="icon is-small has-text-primary">
                <i class="fa fa-arrow-down" aria-hidden="true"></i>
              </span>
              <strong class="has-text-primary">{{downloadSpeed}}</strong>
              &nbsp;
              <span class="icon is-small has-text-primary">
                <i class="fa fa-arrow-up" aria-hidden="true"></i>
              </span>
              <strong class="has-text-primary">{{uploadSpeed}}</strong>
            </span>
            <strong class="level-item has-text-primary">{{timeRemaining}} remaining</strong>
          </div>
        </nav>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'progresser',
  props: ['progressInfo'],
  computed: {
    filename () {
      if (this.progressInfo.files.length === 0) {
        return 'Loading...'
      }
      return this.progressInfo.files[0].path.split('/')[0]
    },
    downloadSpeed () {
      return this.computeSpeed(this.progressInfo.downloadSpeed)
    },
    uploadSpeed () {
      return this.computeSpeed(this.progressInfo.uploadSpeed)
    },
    totalLength () {
      let total = 0
      for (let f of this.progressInfo.files) {
        total += f.length
      }
      return this.computeLength(total)
    },
    downloaded () {
      return this.computeLength(this.progressInfo.downloaded)
    },
    progress () {
      return (this.progressInfo.progress * 100).toFixed(2)
    },
    timeRemaining () {
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
    }
  },
  methods: {
    computeSpeed (speed) {
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

  .title {
    width: 50rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden
  }

  progress {
    width: 3rem;
  }
}
</style>
