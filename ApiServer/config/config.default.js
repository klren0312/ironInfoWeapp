'use strict';

const {SequelizeAdapter} = require('casbin-sequelize-adapter')

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_15323243025_4828';

  // add your config here
  config.middleware = ['errorHandler', 'notfoundHandler']

  // casbin 权限管理配置
  config.zrole = {
    useAdapter: true,
    useAnonymous: true,
    usePolicyInit: true,
    useCustomResponse: true,
    model: 'zzes_model.conf',
    getUser(ctx) {
      let token = ''
      if (
        ctx.headers.authorization &&
        (ctx.headers.authorization.split(' ')[0] === 'Bearer' ||
          ctx.headers.authorization.split(' ')[0] === 'Token')
      ) {
        token = ctx.headers.authorization.split(' ')[1]
      } else if (ctx.query && ctx.query.token) {
        token = ctx.query.token
      } else {
        token = null
      }
      if (token) {
        ctx.logger.info('parse the token', ctx.app.verifyToken(ctx))
        return ctx.app.verifyToken(ctx).role
      } else {
        ctx.logger.info('this people is anonymous')
        return null
      }
    },
    adapterConfig: async () => {
      const connect = await SequelizeAdapter.newAdapter(`mysql://${process.env.DB_USER || 'root'}:${process.env.DB_PASSWORD || 'root'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'}/tlgc`, true)
      return connect
    },
    initPolicy: zrole => {
      zrole.addPolicy('anonymous', '/', 'GET')
      zrole.addPolicy('anonymous', '/api/v1/user/login', 'POST')
      zrole.addPolicy('anonymous', '/api/v1/weapp', '*')
      zrole.addPolicy('superAdmin', '*', '*')
      // tour access
      zrole.addPolicy('tour', '/api/v1/article', 'GET')
      zrole.addPolicy('tour', '/api/v1/wechatUser', 'GET')
      zrole.addPolicy('tour', '/api/v1/homeSum', 'GET')
      zrole.addPolicy('tour', '/api/v1/hot', '*')
      zrole.addPolicy('tour', '/api/v1/iron', 'GET')
      zrole.addPolicy('tour', '/api/v1/article', 'GET')
    },
    customResponse: ctx => {
      ctx.helper.fail({ctx, code: 403, res: '暂无权限!' })
    },
  }

  // 渲染模板配置
  config.view = {
    defaultViewEngine: 'nunjucks'
  }

  // sequelize数据库配置 localhost
  config.sequelize = {
    dialect: 'mysql',
    database: process.env.DB_DATABASE || 'tlgc',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timezone: 'Asia/Shanghai'
  }

  // jwt 配置
  config.jwt = {
    secret: 'jwts',
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
    appName: '治电普钢',
    host: 'smtp.139.com',
    secure: true,
    port: 465,
    auth: {
      user: '',
      pass: ''
    }
  }
  return config;
};
