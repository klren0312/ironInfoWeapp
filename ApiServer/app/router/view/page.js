'use strict';

module.exports = app => {
  const { controller, router, middleware } = app;
  router.get('/', controller.view.page.clone);
  router.get('/home', controller.view.page.index);
  router.get('/irons', controller.view.page.irons);
  router.get('/map', controller.view.page.map);
  router.get('/cars', middleware.pagination, controller.view.page.cars);
  router.get('/m3u8', controller.view.page.m3u8);
};
