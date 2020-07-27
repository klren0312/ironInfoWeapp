'use strict';

module.exports = app => {
  const { controller, middleware, apiV1Router } = app;

  // 获取微信小程序用户
  apiV1Router.get('/wuser', app.jwt, middleware.pagination, controller.api.v1.wuser.getInfo);

  // 获取微信小程序接口请求计数
  apiV1Router.get('/wpath', app.jwt, controller.api.v1.wuser.countReq);
};
