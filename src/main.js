// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'

Vue.use(Vuex)

import List from '@/components/List'
import Help from '@/components/Help'
import PDF from '@/components/PDF'
import Login from '@/components/Login'
Vue.component('List', List)
Vue.component('Help', Help)
Vue.component('PDF', PDF)
Vue.component('Login', Login)

Vue.config.productionTip = false

/* eslint-disable no-new */
var appLists = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})