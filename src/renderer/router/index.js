import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/components/Index'),
      redirect: 'monitor',
      children: [
        {
          path: 'monitor',
          name: 'monitor',
          component: require('@/components/Monitor')
        },
        {
          path: 'finish',
          name: 'finish',
          component: require('@/components/Finish')
        },
        {
          path: 'wastebasket',
          name: 'wastebasket',
          component: require('@/components/Wastebasket')
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
