// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/override-element-ui.css'
import VeLine from 'v-charts/lib/line.common'
import VePie from 'v-charts/lib/pie.common'
import 'echarts/lib/component/dataZoom'
import request from './api/request'
import store from './store'
import './components/install'
import myFilter from './utils/myFilter'
import 'normalize.css'
import Storage from 'zstorage'
import Loading from './components/MyLoading'

for(let key in myFilter) {
  Vue.filter(key, myFilter[key])
}
Vue.component(VeLine.name, VeLine)
Vue.component(VePie.name, VePie)

Vue.prototype.$http = request
Vue.prototype.$store = store
Vue.prototype.$storage = Storage

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Loading)

// 判断登录态是否超时
const userData = Storage.get('admin_user')

if (userData === null || userData === undefined) {
  store.commit('SET_USER', null)
} else {
  store.commit('SET_USER', userData)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})