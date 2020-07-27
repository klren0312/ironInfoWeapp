'use strict';

const Service = require('egg').Service;

class WuserService extends Service {
  /**
   * 保存用户信息
   * @param {Object} info 用户信息
   */
  async saveInfo(info) {
    const res = await this.getInfoByOpenId(info.openId);
    if (res) {
      return {};
    }
    return await this.ctx.model.Wuser.create(info);

  }

  /**
   * 通过openId来获取用户信息
   * @param {String} id openId
   */
  async getInfoByOpenId(id) {
    const info = await this.ctx.model.Wuser.findOne({
      where: {
        openId: id,
      },
    });
    console.log(info);
    if (!info) {
      return null;
    }
    return info;
  }

  /**
   * 通过openId来记录用户访问次数
   */
  async countUserByOpenId(id) {
    return await this.ctx.model.Wuser.update({
      count: this.app.Sequelize.literal('count+1'),
    }, {
      where: {
        openId: id,
      },
    });
  }

  /**
   * 获取微信小程序接口请求数量
   */
  async getReqCount() {
    return await this.ctx.model.Path.findAll();
  }

  /**
   * 给微信用户绑定后台用户
   *
   * @param {Int} userId 用户Id
   * @param {String} openId 微信用户Id
   */
  async bindUserToWuser(userId, openId) {
    const { ctx } = this;
    const { Wuser } = ctx.model;
    const wuser = await this.getInfoByOpenId(openId);
    if (wuser) {
      return await Wuser.update({
        userId,
      }, {
        where: {
          openId,
        },
      });
    }
    return false;

  }

  /**
   * 获取微信用户绑定的后台用户
   * @param {String} openId
   */
  async getBindUser(openId) {
    const { ctx } = this;
    const { user: userService } = ctx.service.v1;
    const wuser = await this.getInfoByOpenId(openId);
    if (wuser) {
      return await userService.findById(wuser.userId);
    }
    return false;
  }
}

module.exports = WuserService;
