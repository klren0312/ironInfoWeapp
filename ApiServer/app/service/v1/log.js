/**
 * 统一日志处理服务
 */
const Service = require('egg').Service;
const moment = require('moment');


class LogService extends Service {
  /**
   * 添加日志
   * @param {object} log            日志信息
   * @param {string} log.admin_id    用户名
   * @param {string} log.login_ip   ip
   * @return {Promise(object)}      日志信息
   */
  async addLog(userLog) {
    const {
      Log,
    } = this.ctx.model;
    const ip = userLog.ip;
    let formatIp = '';
    if (ip === '::1' || ip === '127.0.0.1') {
      formatIp = '本地访问';
    } else if (ip.indexOf('::ffff:') > -1) {
      formatIp = ip.split('::ffff:')[1];
    } else {
      formatIp = ip;
    }
    userLog.ip = formatIp;
    this.ctx.logger.info(`the ip is ${formatIp}`);
    if (formatIp !== '本地访问') {
      try {
        const location = await this.getIpLocation(formatIp);
        this.ctx.logger.info(`the location is ${location}`);
        if (location) {
          userLog.location = location;
        } else {
          userLog.location = null;
        }
      } catch (e) {
        userLog.location = null;
        this.ctx.logger.error(e);
      }
    }
    return Log.create(userLog);
  }

  /**
   * 更新动作日志
   * @param {Array} ctrlData 动作数组
   *
   * @return {Object} 返回结果
   */
  async updateLogCtrl(ctrlData) {
    const { ctx, app } = this;
    const { req } = ctx;
    const { Record } = ctx.model;
    const res = app.verifyToken(ctx);
    const data = await Record.create({
      admin: res.username,
      ctrl: ctrlData,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
    return data;
  }

  /**
   * 删除一个月前日志
   *
   */
  async delBeforeMonth() {
    const {
      Log,
    } = this.ctx.model;
    const data = await Log.query('DELETE FROM log WHERE time <= DATE_SUB(CURDATE(),INTERVAL 1 MONTH)');
    return data;
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
  }) {
    const {
      pagination,
    } = this.ctx.helper;
    const {
      order,
      offset,
      limit,
    } = pagination(page);

    return this.ctx.model[modelName].findAll({
      where,
      order,
      offset,
      limit,
      attributes,
    });
  }

  /**
   * 小程序接口统计与日志
   * @param {String} path api
   * @return 结果
   */
  async weappLog(path) {
    const { ctx, app } = this;
    const {
      Path,
    } = ctx.model;
    const remote = await Path.findAll({
      where: {
        path,
      },
    });
    if (remote) {
      return Path.update({
        times: app.Sequelize.literal('times+1'),
      }, {
        where: {
          path,
        },
      });
    }
    return false;

  }

  /**
   * 获取IP归属地
   * @param {String} ip
   */
  async getIpLocation(ip) {
    const { ctx } = this;
    const result = await ctx.helper.request({
      ctx,
      url: `http://ip-api.com/json/${ip}?lang=zh-CN`,
      method: 'GET',
    });
    ctx.logger.info(result.data);
    if (result.data && result.data.status === 'success') {
      const data = result.data;
      return `${data.country} | ${data.regionName} | ${data.city} | ${data.isp} | ${data.as}`;
    }
    return null;

  }
}

module.exports = LogService;
