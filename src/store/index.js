import Vue from 'vue'
import Vuex from 'vuex'
import Show from './modules/show'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  namespaced: true,
  modules: {
    show: Show
  },
  strict: debug
})
