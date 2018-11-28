import Vue from 'vue'
import Router from 'vue-router'

import ShowAdd from '../pages/showAdd/showAdd'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'showadd',
      component: ShowAdd
    }
  ]
})
