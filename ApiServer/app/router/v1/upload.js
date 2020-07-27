'use strict';

module.exports = app => {
  const { controller, middleware, apiV1Router } = app;
  // upload file
  apiV1Router.post('/upload', middleware.log, app.jwt, controller.api.v1.upload.index);
};
