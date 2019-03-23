'use strict'

module.exports = app => {
  const { controller, middleware, apiV1Router } = app

  // 获取全部钢材信息
  apiV1Router.get('/weapp/iron/all', middleware.weapp, controller.weapp.getAllIron)
  // 通过钢材名称查询
  apiV1Router.get('/weapp/iron', middleware.weapp, controller.weapp.getIronByName)
  // 获取钢材选择
  apiV1Router.get('/weapp/iron/option', middleware.weapp, controller.weapp.getIronSelectList)
  // 获取文章列表
  apiV1Router.get('/weapp/article', middleware.weapp, middleware.pagination, controller.article.getArticleList)
  // 获取热门钢材信息
  apiV1Router.get('/weapp/hot', middleware.weapp, controller.hot.getAllHot)
  // 小程序登录
  apiV1Router.post('/weapp/login', middleware.weapp, middleware.pagination, controller.weapp.login)
  // 获取新闻
  apiV1Router.post('/weapp/news', middleware.weapp, controller.data.getNews)
  // 获取天气
  apiV1Router.get('/weapp/weather', middleware.weapp, controller.data.getWeather)
}
