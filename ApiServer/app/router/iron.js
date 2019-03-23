'use strict'

module.exports = app => {
  const { controller, middleware, apiV1Router } = app
 

  // 添加钢材信息
  apiV1Router.post('/iron', middleware.log, app.jwt, controller.iron.createIron)

  // 获取钢材列表
  apiV1Router.get('/iron', app.jwt, middleware.pagination, controller.iron.getIronList)
  
  // 获取全部钢材信息
  apiV1Router.get('/iron/all', controller.weapp.getAllIron)
  
  // 更新钢材信息
  apiV1Router.patch('/iron', middleware.log, app.jwt, controller.iron.updateIron)

  // 删除钢材信息
  apiV1Router.delete('/iron', middleware.log, app.jwt, controller.iron.deleteIron)

  // 更新钢材价格
  apiV1Router.post('/iron/price', middleware.log, app.jwt, controller.iron.updateIronPrice)
}
