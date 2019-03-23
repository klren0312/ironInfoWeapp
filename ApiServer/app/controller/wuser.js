'use strict';

const Controller = require('egg').Controller;

class WuserController extends Controller {
  /**
   * 分页获取小程序用户
   */
  async getInfo() {
    const { ctx } = this
    let { page } = ctx
    const { common } = ctx.service
    const search = ctx.request.query
    let where = {}
    if(search.hasOwnProperty('nickName')&& search.nickName !== '') {
      where = {
        nickName: { $like: `%${search.nickName}%` }
      }
    }
    page = {
      ...page,
      pageField: 'id',
      pageSort: 'DESC'
    }
    const [total, items] = await Promise.all([
      common.findCount({ modelName: 'Wuser' }),
      common.findPage({ modelName: 'Wuser', page, where }),
    ])
    const res = { total, items, pageSize: page.pageSize, pageIndex: page.pageIndex }
    ctx.helper.success({ ctx, res: res })
  }
}

module.exports = WuserController;
