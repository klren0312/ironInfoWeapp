'use strict';

const Controller = require('egg').Controller;

class CarController extends Controller {
  /**
   * 获取汽车信息
   */
  async getCars() {
    const { ctx, app } = this
    let { page } = ctx
    const { common } = ctx.service.v1
    const search = ctx.request.query
    let where = {}
    if (search.hasOwnProperty('name') && search.name !== '') {
      where = {
        name: { [app.Sequelize.Op.like]: `%${search.name}%` }
      }
    }
    page = {
      ...page,
      pageField: 'id',
      pageSort: 'DESC'
    }
    const include = []
    const [total, items] = await Promise.all([
      common.findCount({ dataModel: 'modelcar', modelName: 'Iron' }),
      common.findPage({
        dataModel: 'modelcar',
        modelName: 'Car',
        page,
        include,
        where
      })
    ])
    const res = { total, items, pageSize: page.pageSize, pageIndex: page.pageIndex }
    ctx.helper.success({ ctx, res: res })
  }

  /**
   * 获取所有汽车信息
   */
  async getAllCars() {
    const { ctx } = this
    const { car } = ctx.service.v1
    const result = await car.getAllCars()
    if (result) {
      ctx.helper.success({ ctx, res: result })
    } else {
      ctx.helper.fail({ ctx, res: '获取失败' })
    }
  }
}

module.exports = CarController;
