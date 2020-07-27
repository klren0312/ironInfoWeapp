'use strict';
const moment = require('moment');
/**
 * 请求记录中间件
 */
module.exports = async (ctx, next) => {
  const { log } = ctx.service.v1;
  const thePath = ctx.request.path.split('/api/v1');
  log.weappLog(thePath[1]);
  return next();
};
