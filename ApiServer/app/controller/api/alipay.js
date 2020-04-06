'use strict'

const Controller = require('egg').Controller

class AlipayController extends Controller {
  /**
   * PC网页支付
   */
  async pay() {
    const { ctx } = this
    const { alipay } = ctx.service
    const data = ctx.request.body
    ctx.validate({
      outTradeNo: {type: 'string', require: true},
      totalAmount: {type: 'number', max:100000000, min:0.01, require: true},
      subject: {type: 'string', require: true}
    }, data)
    const url = await alipay.pay(data)
    if (url) {
      ctx.status = 201
      ctx.helper.success({ctx, res: url})
    } else {
      ctx.helper.fail({ctx, res: '付款失败'})
    }
  }

  /**
   * 手机端网页支付
   */
  async mobilePay() {
    const { ctx } = this
    const { alipay } = ctx.service
    const data = ctx.request.body
    ctx.validate({
      outTradeNo: {type: 'string', require: true},
      totalAmount: {type: 'number', max:100000000, min:0.01, require: true},
      subject: {type: 'string', require: true}
    }, data)
    const form = await alipay.mobilePay(data)
    if (form) {
      ctx.status = 201
      ctx.helper.success({ctx, res: form})
    } else {
      ctx.helper.fail({ctx, res: '付款失败'})
    }
  }

  /**
   * 支付回调
   */
  async payCallback() {
    const { ctx } = this
    const { alipay } = ctx.service
    const data = ctx.request.body
    const result = await alipay.checkSign(data)
    ctx.body = {
      result
    }
  }

  /**
   * 查询支付
   */
  async query() {
    const {ctx} = this
    const { alipay } = ctx.service
    const outTradeNo = ctx.params.outTradeNo
    ctx.validate({
      outTradeNo: {type: 'string', require: true}
    }, ctx.params)
    const result = await alipay.query(outTradeNo)
    ctx.helper.success({ctx, res: result})
  }

  /**
   * 用户获取自己的订单
   */
  async getOrderByUser () {
    const { ctx, app } = this
    // 获取用户id
    const userInfo = app.verifyToken(ctx)
    const { id: userId, role } = userInfo
    let { page } = ctx
    const { common } = ctx.service
    const search = ctx.request.query
    let where = {}
    where = {
      user_id: userId
    }
    if (role === 'superAdmin') {
      if (search.hasOwnProperty('userId') && search.userId !== '') {
        where = {
          user_id: search.userId
        }
      } else {
        where = {}
      }
    }
    page = {
      ...page,
      pageField: 'id',
      pageSort: 'DESC'
    }
    const include = []
    const [total, items] = await Promise.all([
      common.findCount({ modelName: 'Order' }),
      common.findPage({
        modelName: 'Order',
        page,
        include,
        where
      })
    ])
    const res = { total, items, pageSize: page.pageSize, pageIndex: page.pageIndex }
    ctx.helper.success({ ctx, res: res })
  }

  /**
   * 用户查询订单支付状态
   */
  async checkPay () {
    const { ctx } = this
    const { alipay } = ctx.service
    const outTradeNo = ctx.params.outTradeNo
    const result = await alipay.checkPay(outTradeNo)
    if (result) {
      ctx.helper.success({ctx, res: {status: true}, msg: '支付成功'})
    } else {
      ctx.helper.success({ctx, res: {status: false}, msg: '未支付'})
    }
  }
}

module.exports = AlipayController
