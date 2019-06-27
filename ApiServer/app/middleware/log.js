'use strict'
const moment = require('moment');
/**
 * 日志记录中间件
 */
module.exports = async (ctx, next) => {
  const { log } = ctx.service
  const { request, req, app } = ctx
  if (request.path === '/api/v1/user/login') {
    log.addLoginLog({
      admin: request.body.username,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      time: moment(new Date().toLocaleString()).format('YYYY-MM-DD HH:mm:ss'),
      comment: request.body.username === 'tour' ? '游客登录' : '管理员登录'
    })
  } else {
    const res = app.verifyToken(ctx)
    // console.log('==============================')
    console.log(ctx.request)
    log.addLoginLog({
      admin: res.username,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      time: moment(new Date().toLocaleString()).format('YYYY-MM-DD HH:mm:ss'),
      comment: request.method + ' ' + request.path
    })
  }
  return next()
}
