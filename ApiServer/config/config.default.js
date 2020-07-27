'use strict';

const alipay = require('./alipay');

module.exports = appInfo => {
  const config = exports = {};

  config.assets = {
    publicPath: '/public/',
  };

  // 修改请求body大小 防止 403 Payload Too Large
  config.bodyParser = {
    jsonLimit: '5mb',
    formLimit: '6mb',
  };

  config.alipayConfig = {
    appId: '',
    gateway: 'https://openapi.alipaydev.com/gateway.do',
    signType: 'RSA',
    privateKey: alipay.privateKey,
    alipayPublicKey: alipay.alipayPublicKey,
  };

  // wechat info
  config.wechat = {
    tlgc: { // 钢材信息小程序
      appId: '',
      secret: '',
    },
    public: { // zzes小组公众号
      appId: '',
      secret: '',
    },
    food: { // 食物嘌呤
      appId: '',
      secret: '',
    },
  };

  // 头条小程序
  config.toutiao = {
    tlgc: {
      appId: '',
      secret: '',
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'qqq';

  // add your config here
  config.middleware = [ 'errorHandler', 'notfoundHandler' ];

  // 文件上传配置
  config.multipart = {
    fileExtensions: [ '.xlsx' ],
  };

  // 渲染模板配置
  config.view = {
    defaultViewEngine: 'nunjucks',
  };

  // jwt 配置
  config.jwt = {
    secret: 'sssss',
    getToken(ctx) {
      if (
        ctx.headers.authorization &&
        (ctx.headers.authorization.split(' ')[0] === 'Bearer' ||
          ctx.headers.authorization.split(' ')[0] === 'Token')
      ) {
        return ctx.headers.authorization.split(' ')[1];
      } else if (ctx.query && ctx.query.token) {
        return ctx.query.token;
      }
      return null;
    },
  };

  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS',
  };

  // CSRF 关闭
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // redis配置
  config.redis = {
    client: {
      port: process.env.RS_PORT || 6379, // Redis port
      host: process.env.RS_HOST || '127.0.0.1', // Redis host
      password: '',
      db: 12,
    },
  };

  // email
  config.transporter = {
    appName: '治电普钢',
    host: 'smtp.139.com',
    secure: true,
    port: 465,
    auth: {
      user: '',
      pass: '',
    },
  };
  return config;
};
