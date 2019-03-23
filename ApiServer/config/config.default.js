'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_155025_4828';

  // add your config here
  config.middleware = ['errorHandler', 'notfoundHandler'];

  // 渲染模板配置
  config.view = {
    defaultViewEngine: 'nunjucks'
  }

  // sequelize数据库配置 
  config.sequelize = {
    dialect: 'mysql',
    database: process.env.DB_DATABASE || 'tlgc',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || '3306',
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timezone: 'Asia/Shanghai'
  }

  // jwt 配置
  config.jwt = {
    secret: 'secret',
    getToken(ctx) {
      if (
        ctx.headers.authorization &&
        (ctx.headers.authorization.split(' ')[0] === 'Bearer' ||
          ctx.headers.authorization.split(' ')[0] === 'Token')
      ) {
        return ctx.headers.authorization.split(' ')[1]
      } else if (ctx.query && ctx.query.token) {
        return ctx.query.token
      }
      return null
    }
  }

  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS'
  }

  // CSRF 关闭
  config.security = {
    csrf: {
      enable: false
    }
  }

  // redis配置
  config.redis = {
    client: {
      port: process.env.RS_PORT || 6379,          // Redis port
      host: process.env.RS_HOST || '127.0.0.1',   // Redis host
      password: '',
      db: 12,
    },
  }

  // email
  config.transporter= {
    appName: '',
    host: '',
    secure: true,
    port: 465,
    auth: {
      user: '',
      pass: ''
    }
  }
  return config;
};
