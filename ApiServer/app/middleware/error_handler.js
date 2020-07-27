'use strict';
/**
 * 错误处理中间件
 */
module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      console.log(err);
      if (err.name === 'SequelizeValidationError') {
        err.status = 400;
      }
      if (err.name === 'SequelizeDatabaseError') {
        err.status = 400;
      }
      app.emit('error', err, this);
      const status = err.status || 500;
      // 生产环境下不将错误内容返回给客户端
      const error = status === 500 && app.config.env === 'prod'
        ? '服务器错误，请联系管理员'
        : err.message;
      ctx.helper.fail({ ctx, code: status, res: error, msg: err.message || '' });
      if (status === 422) {
        ctx.helper.fail({ ctx, code: status, res: err.errors });
      }
      ctx.status = status;
    }
  };
};
