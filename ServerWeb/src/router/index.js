import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import RouterArr from './routerArr'
NProgress.configure({ showSpinner: false })

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/pages/login'], resolve)
    },
    ...RouterArr
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (to.path === '/login') {
    if (!store.state.user) {
      next()
      NProgress.done()
    } else {
      next({ path: '/' })
      NProgress.done()
    }
  } else {
    if (store.state.user) {
      next()
      NProgress.done()
    } else {
      next({ path: `/login` })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
