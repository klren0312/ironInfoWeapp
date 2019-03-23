/**
 * 统一日志处理服务
 */

const Service = require('egg').Service
class LogService extends Service {
  /**
   * 添加管理员登录日志
   * @param {object} log            日志信息
   * @param {string} log.admin_id    用户名
   * @param {string} log.login_ip   ip
   * @return {Promise(object)}      日志信息
   */
  async addLoginLog(userLog) {
    const {
      Log
    } = this.ctx.model

    return Log.create(userLog)
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
    attributes = {}
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
      attributes
    })
  }

  /**
   * 小程序接口统计与日志
   * @param {String} path api
   * @return 结果
   */
  async weappLog(path) {
    const { ctx, app } = this
    const {
      Path
    } = ctx.model
    let remote = await Path.findAll({
      where: {
        path: path
      }
    })
    if(remote) {
      return Path.update({times: app.Sequelize.literal('times+1')}, {where: {path: path}})
    } else {
      return false
    }
  }
}

module.exports = LogService
