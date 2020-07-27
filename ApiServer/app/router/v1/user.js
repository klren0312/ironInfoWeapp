'use strict';

module.exports = app => {
  const { controller, middleware, apiV1Router } = app;

  // test
  apiV1Router.get('/test', controller.api.v1.home.index);

  // 用户注册
  apiV1Router.post('/user/register', app.jwt, controller.api.v1.user.register);

  // 用户登录
  apiV1Router.post('/user/login', middleware.log, controller.api.v1.user.login);

  // 获取用户列表
  apiV1Router.get('/user', app.jwt, middleware.pagination, controller.api.v1.user.getAllUser);

  // 更新用户信息
  apiV1Router.put('/user', app.jwt, middleware.log, controller.api.v1.user.updateUserInfo);

  // 删除用户信息
  apiV1Router.delete('/user', app.jwt, middleware.log, controller.api.v1.user.deleteUserById);

  // 获取用户日志
  apiV1Router.get('/log', app.jwt, middleware.pagination, controller.api.v1.user.getUserLog);

  // 获取用户动作日志
  apiV1Router.put('/log/record', app.jwt, middleware.pagination, controller.api.v1.user.updateCtrl);

  // 删除一个月前日志
  apiV1Router.delete('/log', app.jwt, controller.api.v1.user.delLogBeforeMonth);

  // 发送重置邮件
  apiV1Router.post('/email', controller.api.v1.user.sentResetPassCode);

  // 重置密码
  apiV1Router.post('/reset', controller.api.v1.user.resetPassword);

  // 图片验证码
  apiV1Router.get('/captcha', controller.api.v1.user.getCaptcha);

  // 生成二维码
  apiV1Router.get('/qrcode', controller.api.v1.user.getLoginQrcode);

  // 小程序扫码后检测二维码
  apiV1Router.post('/qrcode', controller.api.v1.user.checkLoginQrcode);

  // 获取二维码状态
  apiV1Router.get('/qrcode/status', controller.api.v1.user.checkLoginQrcodeStatus);
};
