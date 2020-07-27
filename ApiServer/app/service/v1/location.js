'use strict';

const Service = require('egg').Service;

class LocationService extends Service {
  /**
   * 获取定位
   */
  async getCurrentLocation() {
    return await this.ctx.model.Location.findAll({
      limit: 1,
      order: [
        [ 'id', 'DESC' ],
      ],
    });
  }

  /**
   * 保存定位
   * @param {object} location 定位(经纬度)
   */
  async setLocation(location) {
    return await this.ctx.model.Location.create(location);
  }

  /**
   * 查询定位信息
   * @param {object} dates 起止日期
   */
  async queryLocation(dates) {
    const { ctx, app } = this;
    return await ctx.model.Location.findAll({
      where: {
        createdAt: {
          [app.Sequelize.Op.lt]: dates.endTime,
          [app.Sequelize.Op.gt]: dates.startTime,
        },
      },
    });
  }
}

module.exports = LocationService;
