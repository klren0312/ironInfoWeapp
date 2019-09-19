'use strict'

module.exports = app => {
  const { controller, middleware, apiV1Router } = app
  apiV1Router.get('/wechat/export', app.jwt, middleware.log, controller.api.wechat.export)
  apiV1Router.get('/wechat/login', app.jwt, middleware.log, controller.api.wechat.login)
  apiV1Router.get('/wechat/logout', app.jwt, middleware.log, controller.api.wechat.logout)
  apiV1Router.get('/wechat/check', app.jwt, middleware.log, controller.api.wechat.checkLogin)
  apiV1Router.get('/wechat/friends', app.jwt, middleware.log, controller.api.wechat.friends)
  apiV1Router.get('/wechat/rooms', app.jwt, middleware.log, controller.api.wechat.rooms)
  apiV1Router.get('/wechat/rooms/members', app.jwt, middleware.log, controller.api.wechat.RoomMembers)
  apiV1Router.get('/wechat/rooms/members/add', app.jwt, middleware.log, controller.api.wechat.RoomMembersAdd)
}
