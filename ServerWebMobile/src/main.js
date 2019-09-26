import Vue from 'vue'
import FastClick from 'fastclick'
import 'normalize.css'
import App from './App.vue'
import './assets/responsive'
import './assets/global.css'
import Storage from 'zstorage'
import store from './store'
import router from './router'

if ('addEventListener' in document && 'ontouchstart' in window) {
  FastClick.prototype.focus = function (targetElement) {
    targetElement.focus()
  }
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}

Vue.prototype.$store = store
Vue.prototype.$storage = Storage

Vue.config.productionTip = false

// 判断登录态是否超时
const userData = Storage.get('admin_user')

if (userData === null || userData === undefined) {
  store.commit('SET_USER', null)
} else {
  store.commit('SET_USER', userData)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
