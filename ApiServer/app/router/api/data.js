'use strict'

module.exports = app => {
  const { controller, apiV1Router } = app

  // 获取微信token
  apiV1Router.get('/token', controller.api.data.getToken)

  // 获取用户画像
  apiV1Router.get('/wechatUser', controller.api.data.getWechatUser)

  // 获取文章, 钢材统计数据
  apiV1Router.get('/homeSum', controller.api.data.getHomeSum)

}
