'use strict';

const Service = require('egg').Service;

class HotService extends Service {
  /**
   * 创建热门钢材
   * @param {Object} iron 钢材信息
   * @return {Object} 钢材信息
   */
  async create(iron) {
    const allHotNum = await this.ctx.model.Hot.count();
    if (allHotNum >= 6) { // 不允许超过六个
      return false;
    }
    return await this.ctx.model.Hot.create(iron);

  }

  /**
   * 获取所有热门钢材
   * @return {Array} 钢材信息
   */
  async getAllIron() {
    return await this.ctx.model.Hot.findAll({
      order: [ 'sort' ],
    });
  }

  /**
   * 查询热门钢材
   * @param {Object} search 搜索钢材的名称
   * @return {Array} 钢材信息
   */
  async getHotByName(search) {
    const { ctx, app } = this;
    let where = {};
    if (search.hasOwnProperty('name') && search.name !== '') {
      where = {
        name: { [app.Sequelize.Op.like]: `%${search.name}%` },
      };
    } else if (search.hasOwnProperty('id') && search.id !== '') {
      where = {
        id: parseInt(search.id),
      };
    } else {
      where = {};
    }
    return await ctx.model.Hot.findAll({
      where,
      order: 'sort',
    });
  }

  /**
   * 删除热门钢材
   * @param {Number} hotId 热门钢材id
   * @return {Object} 结果
   */
  async delete(hotId) {
    return await this.ctx.model.Hot.destroy({ where: { id: hotId } });
  }

  /**
   * 更新热门钢材信息
   * @param {Object} iron 钢材信息
   * @return {Object} 结果
   */
  async updateIron(iron) {
    const { id } = iron;
    delete iron.id;
    return await this.ctx.model.Hot.update(iron, { where: { id } });
  }

  /**
   * 根据id来更改sort字段排序
   * @param {Array} list 排序后的钢材列表
   * @return {Boolean} 结果
   */
  async setSortById(list) {
    const arr = [];
    list.forEach(v => {
      arr.push(this.ctx.model.Hot.update(
        { sort: v.sort },
        {
          where: {
            id: v.id,
          },
        }
      ));
    });
    const result = await Promise.all(arr);
    if (Array.isArray(result) && result.length > 0) {
      return true;
    }
    return false;

  }
}

module.exports = HotService;
