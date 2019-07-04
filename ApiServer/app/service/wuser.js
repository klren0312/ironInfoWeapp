'use strict';

const Service = require('egg').Service;

class WuserService extends Service {
  /**
   * 保存用户信息
   * @param {Object} info 用户信息
   */
  async saveInfo(info) {
    let res = await this.getInfoByOpenId(info.openId)
    console.log(res)
    if(res) {
      console.log('has data')
      return {}
    } else {
      return await this.ctx.model.Wuser.create(info)
    }
  }

  /**
   * 通过openId来获取用户信息
   * @param {String} id openId
   */
  async getInfoByOpenId(id) {
    const info = await this.ctx.model.Wuser.findOne({
      where: {
        openId: id
      }
    })
    console.log(info)
    if (!info) {
      return null
    }
    return info
  }

  /**
   * 通过openId来记录用户访问次数
   */
  async countUserByOpenId(id) {
    return await this.ctx.model.Wuser.update({
      count: this.app.Sequelize.literal('count+1')
    }, {
      where: {
        openId: id
      }
    })
  }
}

module.exports = WuserService;
