'use stricts';
/**
 * 404处理中间件
 */
module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    await next();
    if (ctx.status === 404 && !ctx.body) {
      if (ctx.acceptJSON) {
        ctx.helper.fail({ ctx, res: 'Not Found', code: 404 });
      } else {
        ctx.body = '<h1>Page Not Found</h1>';
      }
    }
  };
};
