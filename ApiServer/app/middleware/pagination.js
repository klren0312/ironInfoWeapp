'use strict';
/**
 * 分页排序中间件
 */
module.exports = async (ctx, next) => {
  const { query } = ctx.request;

  ctx.validate({
    pageField: { type: 'string', required: false },
    pageSort: { type: 'enum', values: [ 'ASC', 'DESC' ], required: false },
    pageSize: { type: 'string', format: /\d+/, required: false },
    pageIndex: { type: 'string', format: /\d+/, required: false },
  }, query);

  const {
    pageField = 'updated_at',
    pageSort = 'DESC',
  } = query;
  // ~~ 用于 Math.floor 的功能, 以及将 undefined, null 转为数字 0
  const pageSize = ~~query.pageSize || 20;
  const pageIndex = ~~query.pageIndex || 1;

  ctx.page = { pageField, pageSort, pageSize, pageIndex };

  return next();
};
