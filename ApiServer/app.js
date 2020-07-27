'use strict'
const Redis = require('ioredis')

module.exports = app => {
  if (app.config.env === 'local') {
    app.beforeStart(async () => {
      // await app.model.sync({ force: true })
    })
  }
  app.ready(async err => {
    if (err) throw err
    const redisDb = app.redis.options.db
    // 监听键失效, 来关闭订单
    app.redis.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], () => {
      const expired_subKey = `__keyevent@${redisDb}__:expired`
      const sub = new Redis({
        ...app.redis.options
      })
      sub.subscribe(expired_subKey, function () {
        sub.on('message', async (info, msg) => {
          const ctx = app.createAnonymousContext()
          const order = await ctx.service.v1.alipay.query(msg)
          if (order.subCode === 'ACQ.TRADE_NOT_EXIST') { // 用户没有登录订单, 订单为没创建
            app.redis.set(msg, 'order', 'EX', 60 * 60)
          } else if (order.trade_status !== 'TRADE_SUCCESS') { // 订单创建, 没支付, 就关闭订单
            ctx.service.v1.alipay.close(msg)
          }
        })
      })
    })
  })
}
