'use strict';

module.exports = app => {
  const { controller, middleware, apiV1Router } = app;

  // 获取全部钢材信息
  apiV1Router.get('/weapp/iron/all', middleware.weapp, controller.api.v1.weapp.getAllIron);
  // 通过钢材名称查询
  apiV1Router.get('/weapp/iron', middleware.weapp, controller.api.v1.weapp.getIronByName);
  // 获取钢材选择
  apiV1Router.get('/weapp/iron/option', middleware.weapp, controller.api.v1.weapp.getIronSelectList);
  // 获取文章列表
  apiV1Router.get('/weapp/article', middleware.weapp, middleware.pagination, controller.api.v1.article.getArticleList);
  // 获取热门钢材信息
  apiV1Router.get('/weapp/hot', middleware.weapp, controller.api.v1.hot.getAllHot);
  // 小程序登录
  apiV1Router.post('/weapp/login', middleware.weapp, middleware.pagination, controller.api.v1.weapp.login);
  // 获取新闻
  apiV1Router.post('/weapp/news', middleware.weapp, controller.api.v1.data.getNews);
  // 获取天气
  apiV1Router.get('/weapp/weather', middleware.weapp, controller.api.v1.data.getWeather);

  // 记录访问次数
  apiV1Router.put('/weapp/:openId', controller.api.v1.wuser.countWx);

  // 绑定用户
  apiV1Router.post('/weapp/wuser', controller.api.v1.wuser.bindUserToWuser);
};
