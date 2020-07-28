'use strict';

module.exports = app => {
  const { controller, middleware, apiV1Router } = app;


  // 添加钢材信息
  apiV1Router.post('/iron', middleware.log, app.jwt, controller.api.v1.iron.createIron);

  // 获取钢材列表
  apiV1Router.get('/iron', app.jwt, middleware.pagination, controller.api.v1.iron.getIronList);

  // 获取全部钢材信息
  apiV1Router.get('/iron/all', controller.api.v1.weapp.getAllIron);

  // 更新钢材信息
  apiV1Router.patch('/iron', middleware.log, app.jwt, controller.api.v1.iron.updateIron);

  // 删除钢材信息
  apiV1Router.delete('/iron', middleware.log, app.jwt, controller.api.v1.iron.deleteIron);

  // 更新钢材价格
  apiV1Router.post('/iron/price', middleware.log, app.jwt, controller.api.v1.iron.updateIronPrice);

  // upload file
  apiV1Router.post('/iron/excel', middleware.log, app.jwt, controller.api.v1.iron.upParseExcel);

  // 根据id查询历史价格
  apiV1Router.get('/iron/price/:id', middleware.log, app.jwt, controller.api.v1.iron.getPriceById);
};
