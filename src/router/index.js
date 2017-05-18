import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Lists from '@/components/Lists'
import PDF from '@/components/PDF'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Lists',
    component: Lists
  }, {
    path: '/PDF',
    name: 'PDF',
    component: PDF
  }]
})