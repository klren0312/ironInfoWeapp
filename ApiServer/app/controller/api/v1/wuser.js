'use strict';

const Controller = require('egg').Controller;

class WuserController extends Controller {
  /**
   * 分页获取小程序用户
   */
  async getInfo() {
    const { ctx, app } = this
    let { page } = ctx
    const { common } = ctx.service.v1
    const search = ctx.request.query
    let where = {}
    if(search.hasOwnProperty('nickName') && search.nickName !== '') {
      where = {
        nickName: {
          [app.Sequelize.Op.like]: `%${search.nickName}%`
        }
      }
    }
    page = {
      ...page,
      pageSort: 'DESC'
    }
    if (!page.hasOwnProperty('pageField')) {
      page.pageField = 'id'
    }
    const [total, items] = await Promise.all([
      common.findCount({ modelName: 'Wuser' }),
      common.findPage({ modelName: 'Wuser', page, where }),
    ])
    const res = { total, items, pageSize: page.pageSize, pageIndex: page.pageIndex }
    ctx.helper.success({ ctx, res: res })
  }

  
  /**
   * 微信小程序访问计数
   */
  async countWx() {
    const { ctx } = this
    const { wuser } = ctx.service.v1
    const { openId } = ctx.params
    const res = await wuser.countUserByOpenId(openId)
    console.log(res)
    if (res) {
      ctx.helper.success({ ctx, res: '更新成功'})
    } else {
      ctx.helper.fail({ ctx, res: '更新失败' })
    }
  }

  /**
   * 微信小程序接口请求数量
   */
  async countReq() {
    const { ctx } = this
    const { wuser } = ctx.service.v1
    const res = await wuser.getReqCount()
    if (res) {
      ctx.status = 201
      ctx.helper.success({ ctx, res: res })
    } else {
      ctx.helper.fail({ ctx, res: '获取失败' })
    }
  }

  async bindUserToWuser() {
    const { ctx } = this;
    const { wuser, user } = ctx.service.v1
    const { password, username, openId } = ctx.request.body
    ctx.validate({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
      openId: { type: 'string', required: true }
    }, ctx.request.body)
    const result = await user.findByUsername(username)
    // 无用户
    if (!result) {
      ctx.helper.fail({ ctx, res: '用户名或密码错误' })
      return
    }
    // 密码错误
    if (!ctx.helper.bcompare(password, result.password)) {
      ctx.helper.fail({ ctx, res: '用户名或密码错误' })
      return
    }
    const bindRes = await wuser.bindUserToWuser(result.id, openId)
    if (bindRes) {
      ctx.helper.success({ctx, res: bindRes, msg: '绑定成功'})
    } else {
      ctx.helper.fail({ ctx, res: '绑定失败', msg: '绑定失败' })
    }
  }
}

module.exports = WuserController;
