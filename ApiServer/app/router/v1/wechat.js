'use strict';

module.exports = app => {
  const { controller, middleware, apiV1Router } = app;
  apiV1Router.get('/wechat/export', app.jwt, middleware.log, controller.api.v1.wechat.export);
  apiV1Router.get('/wechat/login', app.jwt, middleware.log, controller.api.v1.wechat.login);
  apiV1Router.get('/wechat/logout', app.jwt, middleware.log, controller.api.v1.wechat.logout);
  apiV1Router.get('/wechat/check', app.jwt, middleware.log, controller.api.v1.wechat.checkLogin);
  apiV1Router.get('/wechat/friends', app.jwt, middleware.log, controller.api.v1.wechat.friends);
  apiV1Router.get('/wechat/rooms', app.jwt, middleware.log, controller.api.v1.wechat.rooms);
  apiV1Router.get('/wechat/rooms/members', app.jwt, middleware.log, controller.api.v1.wechat.RoomMembers);
  apiV1Router.get('/wechat/rooms/members/add', app.jwt, middleware.log, controller.api.v1.wechat.RoomMembersAdd);
};
