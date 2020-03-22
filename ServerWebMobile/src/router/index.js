import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/views/loginPage'], resolve)
    },
    {
      name: 'index',
      path: '/',
      redirect: '/homePage'
    },
    {
      name: 'homePage',
      path: '/homePage',
      component: resolve => require(['@/views/homePage'], resolve)
    },
    {
      name: 'ironPage',
      path: '/ironPage',
      component: resolve => require(['@/views/ironPage'], resolve)
    },
    {
      name: 'ironForm',
      path: '/ironForm',
      component: resolve => require(['@/views/ironPage/form.vue'], resolve)
    },
    {
      name: 'hotPage',
      path: '/hotPage',
      component: resolve => require(['@/views/hotPage'], resolve)
    },
    {
      name: 'articlePage',
      path: '/articlePage',
      component: resolve => require(['@/views/articlePage'], resolve)
    },
    {
      name: 'articleDetails',
      path: '/articlePage/:id',
      component: resolve => require(['@/views/articlePage/details.vue'], resolve)
    },
    {
      name: 'weixinPage',
      path: '/weixinPage',
      component: resolve => require(['@/views/weixinPage'], resolve)
    },
    {
      name: 'userPage',
      path: '/userPage',
      component: resolve => require(['@/views/userPage'], resolve)
    },
    {
      name: 'logPage',
      path: '/logPage',
      component: resolve => require(['@/views/logPage'], resolve)
    },
    {
      name: 'shopPage',
      path: '/shopPage',
      component: resolve => require(['@/views/shopPage'], resolve)
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    if (!store.state.user) {
      next()
    } else {
      next({ path: '/' })
    }
  } else {
    if (store.state.user) {
      next()
    } else {
      next({ path: `/login` })
    }
  }
})

export default router
