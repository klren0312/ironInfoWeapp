'use strict'

const Service = require('egg').Service

class UserService extends Service {
  /**
   * 创建用户
   * @param {Object} user 用户信息
   * @return {Object} 用户信息
   */
  async create(user) {
    return await this.ctx.model.User.create(user)
  }

  /**
   * 通过邮箱查找用户
   * @param {String} email 邮箱
   * @return {Object} user 用户信息
   */
  async findByEmail(email) {
    const user = await this.ctx.model.User.findOne({ where: { email } })
    if (!user) {
      this.ctx.throw(404, 'user not found')
    }
    return user
  }

  /**
   * 通过用户名查找用户
   * @param {String} username 用户名
   * @return {Object} user 用户信息
   */
  async findByUsername(username) {
    const user = await this.ctx.model.User.findOne({
      where: { username }
    })
    if (!user) {
      this.ctx.throw(404, 'user not found')
    }
    return user
  }

  /**
   * 通过id查找用户
   * @param {Int} id 用户id
   * @return {Object} user 用户信息
   */
  async findById(id) {
    const { ctx } = this
    const user = await ctx.model.User.findOne({
      where: { id }
    })
    if (!user) {
      this.ctx.throw(404, 'user not found')
    }
    return user
  }

  /**
   * 更新用户信息
   * @param {Object} values 更新信息
   * @param {Int} id 用户id
   * @return {Object} 更新结果
   */
  async update(values) {
    const user = await this.ctx.model.User.findById(values.id)
    if (!user) {
      this.ctx.throw(404, 'user not found')
    }
    delete values.id
    return user.update(values)
  }

  /**
   * 通过id删除用户
   * @param {Int} id 用户id
   * @return {String} 结果
   */
  async deleteById(id) {
    // console.log(id)
    const user = await this.ctx.model.User.destroy({ where: { id } })
    if (!user) {
      this.ctx.throw(404, '没有此用户')
    }
    else if (user) {
      return '用户删除成功'
    } else {
      return '请联系管理员！'
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

    })
    if (!user) {
      this.ctx.throw(404, 'there has no data')
    }
    return user
  }


}

module.exports = UserService
