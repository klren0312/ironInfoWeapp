'use strict';
const moment = require('moment');
/**
 * 日志记录中间件
 */
module.exports = async (ctx, next) => {
  const { log } = ctx.service.v1;
  const { request, req, app } = ctx;
  if (request.path !== '/api/v1/user/login') {
    const res = app.verifyToken(ctx);
    // console.log('==============================')
    ctx.logger.info(ctx.request);
    log.addLog({
      admin: res.username,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      comment: request.method + ' ' + request.path,
      user_id: res.id,
    });
  }
  return next();
};
