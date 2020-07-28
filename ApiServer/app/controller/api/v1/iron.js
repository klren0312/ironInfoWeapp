'use strict'

const Controller = require('egg').Controller

class IronController extends Controller {

  /**
   * 创建钢材
   */
  async createIron() {
    const { ctx } = this
    const { iron } = ctx.service.v1
    const tiron = ctx.request.body
    ctx.validate({
      name: { type: 'string', required: true },
      intro: { type: 'string', required: true },
      new_price: { type: 'number', required: true }
    }, tiron)
    const result = await iron.create(
      tiron,
      {
        include: {
          model: this.ctx.model.Price
        }
      }
    )
    const priceResult = await iron.savePrice({
      iron_id: result.id,
      price: tiron.new_price
    })
    if (priceResult) {
      ctx.status = 201
      ctx.helper.success({ ctx, res: '录入成功' })
    } else {
      ctx.helper.fail({ ctx, res: '录入失败' })
    }
  }

  /**
   * 根据钢材id获取历史价格
   */
  async getPriceById() {
    const { ctx } = this;
    const { iron: ironService } = ctx.service.v1;
    console.log(ctx.params)
    const { id } = ctx.params;
    ctx.validate({
      id: { type: 'string', required: true },
    }, ctx.params);
    const result = await ironService.getPriceById(id);
    if (result) {
      ctx.helper.success({ ctx, res: result, msg: '查询成功' });
    } else {
      ctx.helper.fail({ctx, res: [], msg: '查询失败'})
    }
  }

  /**
   * 删除钢材
   */
  async deleteIron() {
    const { ctx } = this
    const { iron } = ctx.service.v1
    const ironInfo = ctx.request.body
    ctx.validate({
      id: { type: 'number', required: true }
    }, ironInfo)
    const result = await iron.delete(ironInfo.id)
    if (result !== 0) {
      ctx.helper.success({ ctx, res: '钢材删除成功' })
    } else {
      ctx.helper.fail({ ctx, res: '钢材删除失败' })
    }
  }

  /**
   * 更新钢材信息
   */
  async updateIron() {
    const { ctx } = this
    const { iron } = ctx.service.v1
    const newIronInfo = ctx.request.body
    ctx.validate({
      id: { type: 'number', required: true }
    }, newIronInfo)
    const result = await iron.updateIron(newIronInfo)
    if (result[0] !== 0) {
      ctx.helper.success({ ctx, res: '修改成功' })
    } else {
      ctx.helper.fail({ ctx, res: '修改失败' })
    }
  }

  /**
   * 获取钢材列表
   */
  async getIronList() {
    const { ctx, app } = this
    let { page } = ctx
    const { common } = ctx.service.v1
    const search = ctx.request.query
    let where = {}
    if(search.hasOwnProperty('name') && search.name !== '') {
      where = {
        name: { [app.Sequelize.Op.like]: `%${search.name}%` }
      }
    }
    page = {
      ...page,
      pageField: 'id',
      pageSort: 'DESC'
    }
    // const include = [
    //   {
    //     model: ctx.model['Price'],
    //     as: 'old_price',
    //     attributes: ['price', 'createdAt']
    //   }
    // ]
    const [total, items] = await Promise.all([
      common.findCount({ modelName: 'Iron' }),
      common.findPage({
        modelName: 'Iron',
        page,
        // include,
        where
      })
    ])
    const res = { total, items, pageSize: page.pageSize, pageIndex: page.pageIndex }
    ctx.helper.success({ ctx, res: res })
  }

  /**
   * 更新钢材价格
   */
  async updateIronPrice() {
    const { ctx } = this
    const { iron } = ctx.service.v1
    const ironPrice = ctx.request.body
    ctx.validate({
      id: { type: 'number', required: true },
      price: { type: 'number', required: true }
    }, ironPrice)
    const result = await iron.updatePrice(ironPrice)
    if (result) {
      ctx.helper.success({ ctx, res: '价格更新成功' })
    } else {
      ctx.helper.fail({ ctx, res: '价格更新失败' })
    }
  }

  /**
   * 上传并解析excel
   */
  async upParseExcel() {
    const { ctx } = this
    const { iron } = ctx.service.v1
    const stream = await ctx.getFileStream()
    const content = await iron.parseExcel(stream)
    ctx.helper.success({ctx, res: content})
  }
}

module.exports = IronController