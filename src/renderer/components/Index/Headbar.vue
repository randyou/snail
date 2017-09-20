<template>
  <!-- Main container -->
  <nav class="level is-mobile">
    <!-- Left side -->
    <div class="level-left">
      <div class="level-item">
        <figure class="image logo">
          <img :src="logoUrl">
        </figure>
        <h1 class="title is-2">
          Snail
        </h1>
      </div>
    </div>

    <!-- Right side -->
    <div class="level-right">
      <p class="level-item">
        <a @click="openGithub">
          <span class="icon" style="color: #333;">
            <i class="fa fa-github"></i>
          </span>
        </a>

      </p>
      <!-- <p class="level-item">
              <a href="#" target="_blank">
                <span class="icon" style="color: #55acee;">
                  <i class="fa fa-twitter"></i>
                </span>
              </a>
            </p> -->
    </div>
  </nav>
</template>

<script>
import path from 'path'

export default {
  name: 'headbar',
  computed: {
    logoUrl () {
      const logo = this.$electron.nativeImage.createFromPath(path.join(__dirname, '../../assets/logo.png'))
      return logo.toDataURL()
    }
  },
  methods: {
    openGithub () {
      this.$electron.shell.openExternal('https://github.com/randyou/snail')
    }
  }
}
</script>

<style lang="scss" scoped>
nav {
  height: 100%;

  .logo {
    width: 3.25rem;
    height: 3.25rem;
  }

  .title {
    margin-left: 5px;
    user-select: none;
  }

  .level-right {
    margin-right: 1rem;
  }
}
</style>

