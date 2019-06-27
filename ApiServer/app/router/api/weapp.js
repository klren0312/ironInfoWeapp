'use strict'

module.exports = app => {
  const { controller, middleware, apiV1Router } = app

  // 获取全部钢材信息
  apiV1Router.get('/weapp/iron/all', middleware.weapp, controller.api.weapp.getAllIron)
  // 通过钢材名称查询
  apiV1Router.get('/weapp/iron', middleware.weapp, controller.api.weapp.getIronByName)
  // 获取钢材选择
  apiV1Router.get('/weapp/iron/option', middleware.weapp, controller.api.weapp.getIronSelectList)
  // 获取文章列表
  apiV1Router.get('/weapp/article', middleware.weapp, middleware.pagination, controller.api.article.getArticleList)
  // 获取热门钢材信息
  apiV1Router.get('/weapp/hot', middleware.weapp, controller.api.hot.getAllHot)
  // 小程序登录
  apiV1Router.post('/weapp/login', middleware.weapp, middleware.pagination, controller.api.weapp.login)
  // 获取新闻
  apiV1Router.post('/weapp/news', middleware.weapp, controller.api.data.getNews)
  // 获取天气
  apiV1Router.get('/weapp/weather', middleware.weapp, controller.api.data.getWeather)
  
  // 记录访问次数
  apiV1Router.put('/weapp/:openId', controller.api.wuser.countWx)
}
