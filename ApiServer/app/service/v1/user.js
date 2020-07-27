'use strict';

const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha');

const Redis = require('ioredis');
const redis = new Redis({
  db: 6,
});

class UserService extends Service {
  /**
   * 创建用户
   * @param {Object} user 用户信息
   * @return {Object} 用户信息
   */
  async create(user) {
    return await this.ctx.model.User.create(user);
  }

  /**
   * 生成验证码
   */
  async createCapcha() {
    const captcha = svgCaptcha.create();
    return captcha;
  }

  /**
   * 通过邮箱查找用户
   * @param {String} email 邮箱
   * @return {Object} user 用户信息
   */
  async findByEmail(email) {
    const user = await this.ctx.model.User.findOne({ where: { email } });
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user;
  }

  /**
   * 通过用户名查找用户
   * @param {String} username 用户名
   * @return {Object} user 用户信息
   */
  async findByUsername(username) {
    const user = await this.ctx.model.User.findOne({
      where: { username },
    });
    return user;
  }

  /**
   * 通过id查找用户
   * @param {Int} id 用户id
   * @return {Object} user 用户信息
   */
  async findById(id) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne({
      where: { id },
    });
    if (!user) {
      return false;
    }
    return user;
  }

  /**
   * 更新用户信息
   * @param {Object} values 更新信息
   * @param {Int} id 用户id
   * @return {Object} 更新结果
   */
  async update(values) {
    const user = await this.ctx.service.v1.user.findById(values.id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    delete values.id;
    return user.update(values);
  }

  /**
   * 通过id删除用户
   * @param {Int} id 用户id
   * @return {String} 结果
   */
  async deleteById(id) {
    // console.log(id)
    const user = await this.ctx.model.User.destroy({ where: { id } });
    if (!user) {
      this.ctx.throw(404, '没有此用户');
    } else if (user) {
      return '用户删除成功';
    } else {
      return '请联系管理员！';
    }

  }

  /**
   * 查看所有用户信息
   * @param {Int} limit 每页最大数据
   * @param {Int} offset 数据起始位
   * @return {Array} user 所有用户
   */
  async findAllUser(limit = 10, offset = 0) {
    const user = await this.ctx.model.User.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),

    });
    if (!user) {
      this.ctx.throw(404, 'there has no data');
    }
    return user;
  }

  /**
   * 二维码guid, 用于前端生成二维码
   */
  async genLoginQrcode() {
    const { ctx } = this;
    const guid = ctx.helper.genGuid();
    await redis.set(guid, 'no', 'EX', 60);
    return guid;
  }

  /**
   * 检查二维码guid是否存在
   * 用户是否绑定, 若绑定则将token存入缓存中方便后台查询
   *
   * @param {String} guid 二维码guid
   * @param {String} openId 微信openId
   *
   */
  async checkLoginQrcode(guid, openId) {
    const { ctx, app } = this;
    const { wuser } = ctx.service.v1;
    const check = await redis.get(guid);
    if (check === 'no') {
      const user = await wuser.getBindUser(openId);
      if (user) {
        const token = app.getUserJson(user, ctx, 1);
        await redis.set(guid, JSON.stringify(token));
        return user;
      } else {
        await redis.set(guid, 'yes');
        return '3333'
      }
      return '1111'; // 无此用户
    }
    return '2222'; // 二维码无效

  }

  /**
   * 监测二维码状态
   *
   * @param {string} guid 二维码guid
   */
  async checkLoginQrcodeStatus(guid) {
    const tokenStr = await redis.get(guid);
    if (tokenStr && tokenStr !== 'no' && tokenStr !== 'yes') {
      console.log(tokenStr)
      const token = JSON.parse(tokenStr)
      return token;
    } else if (tokenStr && tokenStr === 'no') {
      return false;
    } else if (tokenStr && tokenStr === 'yes') {
      return 'scan'
    }
    return 'invalid';
  }
}

module.exports = UserService;
