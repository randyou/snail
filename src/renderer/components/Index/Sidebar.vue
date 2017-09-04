<template>
  <aside  @click.prevent="routeTo" class="menu">
    <p class="menu-label">
      本地下载
    </p>
    <ul class="menu-list">
      <li>
        <a data-route="monitor" :class="{'is-active':route==='monitor'}">正在下载</a>
      </li>
      <li>
        <a data-route="done" :class="{'is-active':route==='done'}">已完成</a>
      </li>
      <li>
        <a data-route="wastebasket" :class="{'is-active':route==='wastebasket'}">废纸篓</a>
      </li>
    </ul>
    <p class="menu-label">
      离线下载
    </p>
  </aside>
</template>

<script>
export default {
  name: 'sidebar',
  computed: {
    route () {
      return this.$route.name
    }
  },
  methods: {
    routeTo (e) {
      const target = e.target
      const route = target.dataset.route
      if (target.nodeName.toLowerCase() !== 'a' || !route) {
        return
      }
      this.$router.push({ name: target.dataset.route })
    }
  }
}
</script>

