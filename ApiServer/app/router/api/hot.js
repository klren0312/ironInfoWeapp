'use strict'

module.exports = app => {
  const { controller, middleware, apiV1Router } = app
 

  // 添加热门钢材信息
  apiV1Router.post('/hot', app.jwt, controller.api.hot.createHot)

  // 获取热门钢材列表
  apiV1Router.get('/hot', app.jwt, controller.api.hot.getAllHot)

  // 更新热门钢材信息
  apiV1Router.patch('/hot', middleware.log, app.jwt, controller.api.hot.updateHot)

  // 删除热门钢材信息
  apiV1Router.delete('/hot', middleware.log, app.jwt, controller.api.hot.deleteHot)

  // 热门钢材排序
  apiV1Router.put('/hot', app.jwt, controller.api.hot.sortHotList)
}
