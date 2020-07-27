'use strict';

const Controller = require('egg').Controller;

class LocationController extends Controller {
  /**
   * 获取最新定位
   */
  async getCurrentLocation() {
    const { ctx } = this;
    const { location } = ctx.service.v1;
    const result = await location.getCurrentLocation();
    if (result) {
      ctx.helper.success({ ctx, res: result });
    } else {
      ctx.helper.fail({ ctx, res: [] });
    }
  }

  /**
   * 获取指定时间段定位
   */
  async getLocationByDate() {
    const { ctx } = this;
    const { location } = ctx.service.v1;
    const date = ctx.request.query;
    const result = await location.queryLocation(date);
    if (result) {
      ctx.helper.success({ ctx, res: result });
    } else {
      ctx.helper.fail({ ctx, res: [] });
    }
  }

  /**
   * 保存定位
   */
  async saveLocation() {
    const { ctx } = this;
    const { location } = ctx.service.v1;
    const local = ctx.request.body;
    console.log(ctx.request.body);
    ctx.validate({
      latitude: { type: 'number', required: true },
      longitude: { type: 'number', required: true },
    }, local);
    const result = await location.setLocation(local);
    if (result) {
      ctx.helper.success({ ctx, res: '保存成功' });
    } else {
      ctx.helper.fail({ ctx, res: '保存失败' });
    }
  }
}

module.exports = LocationController;
