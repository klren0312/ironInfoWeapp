'use strict'

const Controller = require('egg').Controller

class HotController extends Controller {

  /**
   * 创建热门钢材
   */
  async createHot() {
    const { ctx } = this
    const { hot } = ctx.service.v1
    const iron = ctx.request.body
    ctx.validate({
      name: { type: 'string', required: true },
      icon: { type: 'string', required: true },
      ironId: { type: 'number', required: true }
    }, iron)
    const result = await hot.create(
      iron
    )
    if (result) {
      ctx.status = 201
      ctx.helper.success({ ctx, res: '录入成功' })
    } else {
      ctx.helper.fail({ ctx, res: '录入失败' })
    }
  }

  /**
   * 删除热门钢材
   */
  async deleteHot() {
    const { ctx } = this
    const { hot } = ctx.service.v1
    const ironInfo = ctx.request.body
    ctx.validate({
      id: { type: 'number', required: true }
    }, ironInfo)
    const result = await hot.delete(ironInfo.id)
    if (result !== 0) {
      ctx.helper.success({ ctx, res: '热门钢材删除成功' })
    } else {
      ctx.helper.fail({ ctx, res: '热门钢材删除失败' })
    }
  }

  /**
   * 更新热门钢材信息
   */
  async updateHot() {
    const { ctx } = this
    const { hot } = ctx.service.v1
    const newIronInfo = ctx.request.body
    ctx.validate({
      id: { type: 'number', required: true },
      ironId: { type: 'number', required: true }
    }, newIronInfo)
    const result = await hot.updateIron(newIronInfo)
    if (result[0] !== 0) {
      ctx.helper.success({ ctx, res: '修改成功' })
    } else {
      ctx.helper.fail({ ctx, res: '修改失败' })
    }
  }

  /**
   * 获取所有热门钢材
   */
  async getAllHot() {
    const { ctx } = this
    const { hot } = ctx.service.v1
    const result = await hot.getAllIron()
    if (result) {
      ctx.helper.success({ ctx, res: result })
    } else {
      ctx.helper.fail({ ctx, res: '获取热门钢材失败' })
    }
  }

  /**
   * 获取热门钢材列表
   */
  async getHotList() {
    const { ctx } = this
    let { page } = ctx
    const { common } = ctx.service.v1
    const search = ctx.request.query
    let where = {}
    if(search.hasOwnProperty('name')&& search.name !== '') {
      where = {
        name: { [app.Sequelize.Op.like]: `%${search.name}%` }
      }
    }
    page = {
      ...page,
      pageField: 'id',
      pageSort: 'DESC'
    }
    

    const [total, items] = await Promise.all([
      common.findCount({ modelName: 'Hot' }),
      common.findPage({
        modelName: 'Hot',
        page,
        where
      })
    ])
    const res = { total, items, pageSize: page.pageSize, pageIndex: page.pageIndex }
    ctx.helper.success({ ctx, res: res })
  }

  /**
   * 热门排序
   */
  async sortHotList() {
    const { ctx } = this
    const { hot } = ctx.service.v1
    const { list } = ctx.request.body
    if(Array.isArray(list) && list.length > 0) {
      const result = await hot.setSortById(list)
      if (result) {
        ctx.helper.success({ ctx, res: '排序修改成功' })
      } else {
        ctx.helper.fail({ ctx, res: '排序修改失败' })
      }
    } else {
      ctx.helper.fail({ ctx, res: '列表为空, 排序修改失败' })
    }
  }
}

module.exports = HotController