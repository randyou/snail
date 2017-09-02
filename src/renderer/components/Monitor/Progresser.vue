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
            movie HD.mkv
          </p>
        </div>
        <nav class="level is-mobile">
          <div class="level-left">
            <a class="level-item">
              <span class="icon is-small">
                <i class="fa fa-pause" aria-hidden="true"></i>
              </span>
            </a>
            <progress class="level-item progress is-primary is-small" value="25" max="100">15%</progress>
            <span class="level-item ">
              <strong class="has-text-primary">25</strong>
              <span class="icon is-small has-text-primary">
                <i class="fa fa-percent" aria-hidden="true"></i>
              </span>
            </span>
            <strong class="level-item has-text-primary">100KB / 2.3GB</strong>
            <span class="level-item">
              <span class="icon is-small has-text-primary">
                <i class="fa fa-arrow-down" aria-hidden="true"></i>
              </span>
              <strong class="has-text-primary">200kb/s</strong>
              <span class="icon is-small has-text-primary">
                <i class="fa fa-arrow-up" aria-hidden="true"></i>
              </span>
              <strong class="has-text-primary">200kb/s</strong>
            </span>
            <strong class="level-item has-text-primary">2 hours remaining</strong>
          </div>
        </nav>
      </div>
    </article>
  </div>
</template>


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
