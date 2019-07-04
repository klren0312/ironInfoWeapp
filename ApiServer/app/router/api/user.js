'use strict'

module.exports = app => {
  const { controller, middleware, apiV1Router } = app
 

  // 用户注册
  apiV1Router.post('/user/register', app.jwt, controller.api.user.register)

  // 用户登录
  apiV1Router.post('/user/login', middleware.log, controller.api.user.login)

  // 获取用户列表
  apiV1Router.get('/user', app.jwt, middleware.pagination, controller.api.user.getAllUser)

  // 更新用户信息
  apiV1Router.put('/user', app.jwt, middleware.log, controller.api.user.updateUserInfo)

  // 删除用户信息
  apiV1Router.delete('/user', app.jwt, middleware.log, controller.api.user.deleteUserById)

  // 获取用户日志
  apiV1Router.get('/log', app.jwt, middleware.pagination, controller.api.user.getUserLog)

  // 发送重置邮件
  apiV1Router.post('/email', controller.api.user.sentResetPassCode)

  // 重置密码
  apiV1Router.post('/reset', controller.api.user.resetPassword)
}
