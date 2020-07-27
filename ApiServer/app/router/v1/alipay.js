'use strict';

module.exports = app => {
  const { controller, apiV1Router, middleware } = app;

  // 付款
  apiV1Router.post('/pay', app.jwt, middleware.log, controller.api.v1.alipay.pay);

  // 手机付款
  apiV1Router.post('/mobilePay', app.jwt, middleware.log, controller.api.v1.alipay.mobilePay);

  // 支付回调接口
  apiV1Router.post('/pay/cb', controller.api.v1.alipay.payCallback);

  // 查询支付状态
  apiV1Router.get('/pay/order/:outTradeNo', app.jwt, controller.api.v1.alipay.query);

  // 获取用户对应订单
  apiV1Router.get('/pay/order', app.jwt, middleware.pagination, controller.api.v1.alipay.getOrderByUser);

  // 用户查询支付状态
  apiV1Router.get('/pay/status/:outTradeNo', app.jwt, controller.api.v1.alipay.checkPay);
};
