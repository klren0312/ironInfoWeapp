const Layout = resolve => require(['@/pages/layout'], resolve)
const routerArr = [
  {
    path: '/',
    component: Layout,
    meta: { show: false },
    children: [{
      name: 'index',
      path: '',
      redirect: '/homePage'
    }]
  },
  {
    path: '/homePage',
    component: Layout,
    meta: { show: true, name: '总览' },
    children: [{
      name: 'homePage',
      path: '',
      component: resolve => require(['@/pages/homePage'], resolve)
    }]
  },
  {
    path: '/tlgc',
    component: Layout,
    meta: { show: true, name: '治电普钢' },
    children: [{
      name: 'ironList',
      path: 'ironList',
      component: resolve => require(['@/pages/ironList'], resolve),
      meta: { show: true, name: '钢材列表' }
    }, {
      name: 'hotManage',
      path: 'hotManage',
      component: resolve => require(['@/pages/hotManage'], resolve)
    }, {
      name: 'wuserManage',
      path: 'wuserManage',
      component: resolve => require(['@/pages/wuserManage'], resolve)
    }, {
      name: 'articleManage',
      path: 'articleManage',
      component: resolve => require(['@/pages/articleManage'], resolve)
    }, {
      name: 'createArticle',
      path: 'createArticle',
      component: resolve => require(['@/pages/articleManage/createArticle'], resolve)
    }, {
      name: 'editArticle',
      path: 'editArticle',
      component: resolve => require(['@/pages/articleManage/editArticle'], resolve)
    }, {
      name: 'wechatPage',
      path: 'wechatPage',
      component: resolve => require(['@/pages/wechatPage'], resolve)
    }, {
      name: 'productPage',
      path: 'productPage',
      component: resolve => require(['@/pages/productPage'], resolve)
    }]
  },
  {
    path: '/userManage',
    component: Layout,
    meta: { show: true, name: '用户管理' },
    children: [{
      name: 'userManage',
      path: '',
      component: resolve => require(['@/pages/userManage'], resolve)
    }]
  },
  {
    path: '/logManage',
    component: Layout,
    meta: { show: true, name: '日志管理' },
    children: [{
      name: 'logManage',
      path: '',
      component: resolve => require(['@/pages/logManage'], resolve)
    }]
  },
  {
    path: '/404',
    component: Layout,
    children: [{
      name: '404',
      path: '',
      component: resolve => require(['@/pages/errorPage'], resolve)
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default routerArr
