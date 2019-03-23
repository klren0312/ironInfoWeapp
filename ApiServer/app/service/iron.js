'use strict'

const Service = require('egg').Service

class IronService extends Service {
  /**
   * 创建钢材
   * @param {Object} iron 钢材信息
   * @return {Object} 钢材信息
   */
  async create(iron) {
    return await this.ctx.model.Iron.create(iron)
  }

  /**
   * 获取所有钢材
   * @return {Array} 钢材信息
   */
  async getAllIron() {
    return await this.ctx.model.Iron.findAll()
  }

  /**
   * 模糊查询, 获取钢材选择列表
   * 只有id和名称
   * @param {Object} search 搜索的钢材名称
   * @return {Array} 钢材列表
   */
  async getIronSelectList(search) {
    let where = {}
    if(search && search.hasOwnProperty('name')) {
      where = {
        name: { $like: `%${search.name}%` }
      }
    }
    return await this.ctx.model.Iron.findAll({
      attributes: ['id', 'name'],
      where
    })
  }

  /**
   * 查询钢材
   * @param {Object} search 搜索钢材的名称
   * @return {Array} 钢材信息
   */
  async getIronByName(search) {
    const {ctx, app} = this
    let where = {}
    if(search.hasOwnProperty('name')&&search.name!=='') {
      where = {
        name: { $like: `%${search.name}%` }
      }
    } 
    else if (search.hasOwnProperty('id')&&search.id!=='') {
      where = {
        id: parseInt(search.id)
      }
    } else {
      where = {}
    }
    return await ctx.model.Iron.findAll({
      where,
      include: [
        {
          model: ctx.model['Price'],
          as: 'old_price',
          attributes: ['price', 'createdAt']
        }
      ]
    })
  }
  /**
   * 删除钢材
   * @param {Number} ironId 钢材id
   * @return {Object} 结果
   */
  async delete(ironId) {
    return await this.ctx.model.Iron.destroy({ 'where': { 'id': ironId } })
  }

  /**
   * 更新钢材信息
   * @param {Object} iron 钢材信息
   * @return {Object} 结果
   */
  async updateIron(iron) {
    const { id } = iron
    delete iron.id
    return await this.ctx.model.Iron.update(iron, { where: { id: id } })
  }

  /**
   * 录入历史价格
   * @param {Number} price 钢材价格
   */
  async savePrice(price) {
    return await this.ctx.model.Price.create(price)
  }

  /**
   * 更新钢材价格
   * @param {Object} iron 钢材信息
   */
  async updatePrice(iron) {
    console.log('钢材价格', iron.price)
    await this.ctx.model.Iron.update({
      new_price: parseFloat(iron.price) 
    },
      {
        where: { id: iron.id }
      })

    return await this.ctx.model.Price.create({
      iron_id: iron.id,
      price: parseFloat(iron.price) 
    })
  }
}

module.exports = IronService