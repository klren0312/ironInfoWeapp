'use strict';

/**
 * 统一日志处理服务
 */

const Service = require('egg').Service;

class CommonService extends Service {
  /**
   * 计数, 求和
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(number)}      数量
   */
  async findCount({ dataModel = 'model', modelName, where = {} }) {
    console.log(dataModel, modelName, this.ctx[dataModel][modelName]);
    return this.ctx[dataModel][modelName].count({
      where,
    });
  }

  /**
   * 分页查
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(array)}       列表
   */
  async findPage({
    dataModel = 'model',
    modelName,
    where = {},
    page,
    attributes = {},
    include = [],
  }) {
    const {
      pagination,
    } = this.ctx.helper;
    const {
      order,
      offset,
      limit,
    } = pagination(page);
    return this.ctx[dataModel][modelName].findAll({
      where,
      order,
      offset,
      limit,
      attributes,
      include,
    });
  }

  /**
   * 查一个
   * @param {string} modelName      模型名称
   * @param {object} where          查询条件
   * @return {Promise(object)}      对象
   */
  async findOne({
    dataModel = 'model',
    modelName,
    where = {},
    attributes = {},
    include = [],
    order = [],
  }) {
    return this.ctx[dataModel][modelName].findOne({ where, include, attributes, order });
  }
}

module.exports = CommonService;
