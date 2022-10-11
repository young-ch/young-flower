import Vue from 'vue'
import Vuex from 'vuex'

// Global vuex
import AppModule from './app'

import persistedState from 'vuex-persistedstate';

// Example Apps
// import BoardModule from '../apps/board/store'
// import EmailModule from '../apps/email/store'
// import TodoModule from '../apps/todo/store'
import UserModule from '@/store/modules/user'
import ErrorModule from '@/store/modules/error'

Vue.use(Vuex)
const getters = {
  params: state => state.params,
}
/**
 * Main Vuex Store
 */
const store = new Vuex.Store({
  modules: {
    app: AppModule,
    user: UserModule,
    error: ErrorModule,
    // 'board-app': BoardModule,
    // 'email-app': EmailModule,
    // 'todo-app': TodoModule
  },
  plugins: [
    persistedState({
      // paths: [''],
    })
  ],
  getters,
  state: {
    params: null
  },
  mutations: {
    setParams(state, payload) {
      state.params = payload
    }
  }
})

export default store
