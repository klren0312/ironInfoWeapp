const menu = [
  {
    index: '/homePage',
    name: '首页总览',
    icon: 'el-icon-star-off',
    hasChildren: false
  },
  {
    index: '/tlgc',
    name: '治电普钢',
    icon: 'el-icon-receiving',
    hasChildren: true,
    children: [
      {
        index: '/tlgc/ironList',
        name: '钢材管理',
        icon: 'el-icon-tickets',
        hasChildren: false
      },
      {
        index: '/tlgc/hotManage',
        name: '热门钢材',
        icon: 'el-icon-time',
        hasChildren: false
      },
      {
        index: '/tlgc/articleManage',
        name: '文章管理',
        icon: 'el-icon-menu',
        hasChildren: false
      },
      {
        index: '/tlgc/wuserManage',
        name: '微信用户',
        icon: 'el-icon-share',
        hasChildren: false
      },
      {
        index: '/tlgc/productPage',
        name: '商品列表',
        icon: 'el-icon-goods',
        hasChildren: false
      }
    ]
  },
  {
    index: '/userManage',
    name: '用户管理',
    icon: 'el-icon-setting',
    hasChildren: false
  },
  {
    index: '/logManage',
    name: '日志列表',
    icon: 'el-icon-document',
    hasChildren: false
  }
]

export default menu
