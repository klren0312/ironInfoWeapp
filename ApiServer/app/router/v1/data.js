'use strict';

module.exports = app => {
  const { controller, apiV1Router } = app;

  // 获取用户画像
  apiV1Router.get('/wechatUser', controller.api.v1.data.getWechatUser);

  // 获取文章, 钢材统计数据
  apiV1Router.get('/homeSum', controller.api.v1.data.getHomeSum);

};
