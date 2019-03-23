'use strict'

module.exports = app => {
  const { controller, middleware, apiV1Router } = app

  // 获取微信小程序用户
  apiV1Router.get('/wuser', app.jwt, middleware.pagination, controller.wuser.getInfo)
}
