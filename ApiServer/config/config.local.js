'use strict';
const { SequelizeAdapter } = require('casbin-sequelize-adapter');

module.exports = appInfo => {
  const config = exports = {};

  // alipay callback
  config.alipayCb = 'http://aae50095.ngrok.io/api/v1/pay/cb';

  // mysql config
  config.dbConfig = {
    database: process.env.DB_DATABASE || 'tlgc',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    baseDir: 'model',
    delegate: 'model',
    timezone: '+08:00',
  };

  config.carDbConfig = {
    database: process.env.DB_DATABASE || 'car',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || '3306',
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    baseDir: 'modelcar',
    delegate: 'modelcar',
    timezone: '+08:00',
  };

  // casbin 权限管理配置
  config.zrole = {
    useAdapter: true,
    useAnonymous: true,
    usePolicyInit: true,
    useCustomResponse: true,
    model: 'zzes_model.conf',
    getUser(ctx) {
      let token = '';
      if (
        ctx.headers.authorization &&
        (ctx.headers.authorization.split(' ')[0] === 'Bearer' ||
          ctx.headers.authorization.split(' ')[0] === 'Token')
      ) {
        token = ctx.headers.authorization.split(' ')[1];
      } else if (ctx.query && ctx.query.token) {
        token = ctx.query.token;
      } else {
        token = null;
      }
      if (token) {
        ctx.logger.info('parse the token', ctx.app.verifyToken(ctx));
        return ctx.app.verifyToken(ctx).role;
      }
      ctx.logger.info('this people is anonymous');
      return null;

    },
    adapterConfig: async () => {
      const connect = await SequelizeAdapter.newAdapter(`mysql://${config.dbConfig.username}:${config.dbConfig.password}@${config.dbConfig.host}:${config.dbConfig.port}/tlgc`, true);
      return connect;
    },
    initPolicy: zrole => {
      zrole.addPolicy('superAdmin', '*', '*');
      zrole.addPolicy('anonymous', '/', 'GET');
      zrole.addPolicy('anonymous', '/api/v1/user/login', 'POST');
      zrole.addPolicy('anonymous', '/api/v1/location', 'POST');
      zrole.addPolicy('anonymous', '/api/v1/location', 'GET');
      zrole.addPolicy('anonymous', '/api/v1/location/current', 'GET');
      zrole.addPolicy('anonymous', '/api/v1/weapp', '*');
      zrole.addPolicy('anonymous', '/api/v1/pay/cb', 'POST');
      zrole.addPolicy('anonymous', '/api/v1/qrcode', '*');
      zrole.addPolicy('anonymous', '/api/v2/toutiao', '*');

      // tour access
      zrole.addPolicy('tour', '/api/v1/article', 'GET');
      zrole.addPolicy('tour', '/api/v1/wechatUser', 'GET');
      zrole.addPolicy('tour', '/api/v1/homeSum', 'GET');
      zrole.addPolicy('tour', '/api/v1/hot', '*');
      zrole.addPolicy('tour', '/api/v1/iron', 'GET');
      zrole.addPolicy('tour', '/api/v1/pay/*', '*');
    },
    customResponse: ctx => {
      ctx.helper.fail({
        ctx,
        code: 403,
        res: '暂无权限!',
      });
    },
  };

  // sequelize数据库配置
  config.sequelize = {
    datasources: [{
      dialect: 'mysql',
      database: config.dbConfig.database,
      host: config.dbConfig.host,
      port: config.dbConfig.port,
      username: config.dbConfig.username,
      password: config.dbConfig.password,
      charset: config.dbConfig.charset,
      collate: config.dbConfig.collate,
      baseDir: config.dbConfig.baseDir,
      delegate: config.dbConfig.delegate,
      timezone: config.dbConfig.timezone,
    }, {
      dialect: 'mysql',
      database: config.carDbConfig.database,
      host: config.carDbConfig.host,
      port: config.carDbConfig.port,
      username: config.carDbConfig.username,
      password: config.carDbConfig.password,
      charset: config.carDbConfig.charset,
      collate: config.carDbConfig.collate,
      baseDir: config.carDbConfig.baseDir,
      delegate: config.carDbConfig.delegate,
      timezone: config.carDbConfig.timezone,
    }],
  };
  return config;
};
