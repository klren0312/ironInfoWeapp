'use strict';

module.exports = app => {
  const { controller, apiV1Router } = app;

  apiV1Router.get('/location/current', controller.api.v1.location.getCurrentLocation);

  apiV1Router.get('/location', controller.api.v1.location.getLocationByDate);

  apiV1Router.post('/location', controller.api.v1.location.saveLocation);

};
