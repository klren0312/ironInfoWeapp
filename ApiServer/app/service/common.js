/**
 * 统一日志处理服务
 */

const Service = require('egg').Service

class CommonService extends Service {
  /**
   * 计数, 求和
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(number)}      数量
   */
  async findCount({ modelName, where = {} }) {
    return this.ctx.model[modelName].count({
      where
    })
  }

  /**
   * 分页查
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(array)}       列表
   */
  async findPage({
    modelName,
    where = {},
    page,
    attributes = {},
    include = [],
  }) {
    const {
      pagination
    } = this.ctx.helper
    const {
      order,
      offset,
      limit
    } = pagination(page)
    return this.ctx.model[modelName].findAll({
      where,
      order,
      offset,
      limit,
      attributes,
      include,
    })
  }

  /**
   * 查一个
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(object)}      对象
   */
  async findOne({
    modelName,
    where = {},
    attributes = {},
    include = [],
    order = []
  }) {
    return this.ctx.model[modelName].findOne({ where, include, attributes, order })
  }
}

module.exports = CommonService
