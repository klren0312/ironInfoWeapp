'use strict';

module.exports = app => {
  const { controller, apiV1Router, middleware } = app;

  // 获取汽车
  apiV1Router.get('/cars', middleware.pagination, controller.api.v1.car.getCars);

  // 获取所有汽车
  apiV1Router.get('/cars/all', controller.api.v1.car.getAllCars);
};
