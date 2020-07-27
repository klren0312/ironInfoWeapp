'use strict'

const Service = require('egg').Service
const AlipaySdk = require('alipay-sdk').default
const AlipayFormData = require('alipay-sdk/lib/form').default

class AlipayService extends Service {
  constructor (app) {
    super(app)
    this.alipaySdk = new AlipaySdk({
      ...this.app.config.alipayConfig
    })    
  }

  /**
   * 获取用户订单列表
   */
  async getOrderByUser () {
    const { ctx, app } = this
    // 获取用户id
    const userInfo = app.verifyToken(ctx)
    const { id: userId } = userInfo
    const result = await ctx.model.Order.findAll({
      where: {
        user_id: userId
      }
    })
    return result
  }

  /**
   * PC网页支付
   * @param {Object} data 
   */
  async pay (data) {
    const { ctx, app } = this
    // 获取用户id
    const userInfo = app.verifyToken(ctx)
    const { id: userId } = userInfo
    const formData = new AlipayFormData()
    const { outTradeNo, totalAmount, subject, body } = data
    const { address, mobile, number } = data
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get');
    formData.addField('notifyUrl', app.config.alipayCb)
    formData.addField('bizContent', {
      outTradeNo: outTradeNo, // 订单号
      productCode: 'FAST_INSTANT_TRADE_PAY',
      totalAmount: totalAmount, // 价格
      subject: subject, // 商品名
      body: body // 商品详情
    })
    const result = await this.alipaySdk.exec(
      'alipay.trade.page.pay',
      {},
      { formData: formData },
    )
    
    // 存入订单
    await ctx.model.Order.create({
      order_id: outTradeNo,
      alipay_id: '',
      user_id: userId,
      total_price: totalAmount,
      product: subject,
      number: number,
      info: body,
      address: address,
      mobile: mobile,
      status: 'WAIT_BUYER_PAY'
    })
    // 订单号存入redis
    this.saveToRedis(outTradeNo)
    // result 为可以跳转到支付链接的 url
    return result
  }

  /**
   * 手机端网页支付
   * @param {Object} data 
   */
  async mobilePay (data) {
    const { ctx, app } = this
    // 获取用户id
    const userInfo = app.verifyToken(ctx)
    const { id: userId } = userInfo
    const { outTradeNo, totalAmount, subject, body } = data
    const { address, mobile, number } = data
    const formData = new AlipayFormData()
    formData.addField('notifyUrl', app.config.alipayCb)
    formData.addField('bizContent', {
      outTradeNo: outTradeNo, // 订单号
      productCode: 'FAST_INSTANT_TRADE_PAY',
      totalAmount: totalAmount, // 价格
      subject: subject, // 商品名
      body: body // 商品详情
    })

    // 获取支付链接
    const result = await this.alipaySdk.exec(
      'alipay.trade.wap.pay',
      {},
      { formData: formData },
    )

    // 存入订单
    await ctx.model.Order.create({
      order_id: outTradeNo,
      alipay_id: '',
      user_id: userId,
      total_price: totalAmount,
      product: subject,
      number: number,
      info: body,
      address: address,
      mobile: mobile,
      status: 'WAIT_BUYER_PAY'
    })
    // 订单号存入redis
    this.saveToRedis(outTradeNo)
    return result
  }

  /**
   * 验签
   * @param {String} data
   */
  async checkSign(data) {
    const {ctx} = this
    const result = await this.alipaySdk.checkNotifySign(data)
    if (result) {
      const {buyer_id, seller_id, trade_status, trade_no, out_trade_no} = data
      const order = await ctx.model.Order.findOne({
        where: {
          order_id: out_trade_no
        }
      })
      if (order) {
        await order.update({
          alipay_id: trade_no,
          status: trade_status,
          buyer_id: buyer_id,
          seller_id: seller_id
        })
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  /**
   * 用户查询订单支付状态
   */
  async checkPay (outTradeNo) {
    const { ctx, app } = this
    // 获取用户id
    const userInfo = app.verifyToken(ctx)
    const { id: userId } = userInfo
    const result = await ctx.model.Order.findOne({
      where: {
        order_id: outTradeNo,
        user_id: userId
      }
    })
    if (result) {
      if (result.status === 'TRADE_SUCCESS') {
        return true
      }
    }
    return false
  }

  /**
   * 查询支付状态
   * @param {String} outTradeNo 
   */
  async query(outTradeNo) {
    const result = await this.alipaySdk.exec('alipay.trade.query', {
      bizContent: {
        outTradeNo: outTradeNo // 订单号
      },
    })
    return result
  }

  /**
   * 关闭订单
   * @param {String} outTradeNo
   */
  async close(outTradeNo) {
    const { ctx } = this
    const result = await this.alipaySdk.exec('alipay.trade.close', {
      bizContent: {
        out_trade_no: outTradeNo // 订单号
      }
    })
    if (result.msg === 'Success') {
      // TRADE_CLOSED
      const order = await ctx.model.Order.findOne({
        where: {
          order_id: outTradeNo
        }
      })
      if (order) {
        order.update({
          status: 'TRADE_CLOSED'
        })
      } else {
      }
    }
    ctx.logger.info(result)
    return result
  }

  /**
   * 将订单号存入redis, 方便定时关闭订单
   * @param {String} outTradeNo 
   */
  async saveToRedis(outTradeNo) {
    const { app } = this
    app.redis.set(outTradeNo, 'order key', 'EX', 60 * 60)
  }
}

module.exports = AlipayService
