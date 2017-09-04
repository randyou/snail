import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
const vm = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
})
vm.$mount('#app')

window.ondragover = (e) => {
  e.preventDefault()
  return false
}
window.ondragleave = (e) => {
  e.preventDefault()
  return false
}
window.ondrop = (e) => {
  e.preventDefault()
  return false
}

window.onbeforeunload = function (e) {
  vm.$electron.ipcRenderer.send('stop-progress')
}
