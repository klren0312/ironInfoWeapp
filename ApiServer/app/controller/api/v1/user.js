'use strict'

const Controller = require('egg').Controller
const moment = require('moment');

class UserController extends Controller {
  /**
   * 用户登录
   */
  async login() {
    const { ctx, app } = this
    const { user, log } = ctx.service.v1
    const { password, username } = ctx.request.body
    const { request, req } = ctx
    ctx.validate({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true }
    }, ctx.request.body)
    const result = await user.findByUsername(username)
    // 无用户
    if (!result) {
      ctx.helper.fail({ ctx, res: '用户名或密码错误' })
      log.addLog({
        admin: request.body.username,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        comment: '无此用户, 登录密码: ' + password
      })
      return
    }
    // 密码错误
    if (!ctx.helper.bcompare(password, result.password)) {
      ctx.helper.fail({ ctx, res: '用户名或密码错误' })

      log.addLog({
        admin: request.body.username,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        comment: '企图登录, 登录密码: ' + password
      })
      return
    }
    log.addLog({
      admin: request.body.username,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      comment: result.role + '登录'
    })
    ctx.helper.success({ ctx, res: app.getUserJson(result, ctx, 1) })
  }

  /**
   * 用户注册
   */
  async register() {
    const { ctx, app } = this
    const { user } = ctx.service.v1
    const usert = ctx.request.body
    ctx.validate({
      email: { type: 'email', required: true },
      username: { type: 'string', required: true },
      password: { type: 'string', required: true }
    }, usert)
    const { email, username } = usert
    const password = ctx.helper.bhash(usert.password)
    const newUser = {
      username,
      email,
      password
    }
    // 创建用户
    const result = await user.create(newUser)
    ctx.status = 201
    ctx.helper.success({ ctx, res: app.getUserJson(result, ctx, 0) })
  }

  /**
   * 获取验证码
   */
  async getCaptcha() {
    const { ctx } = this
    const { user } = ctx.service.v1
    const captcha = await user.createCapcha()
    ctx.session.verifyCode = captcha.text
    ctx.set('Content-Type', 'image/svg+xml')
    ctx.status = 200
    ctx.body = captcha.data
  }

  /**
   * 查询所有用户,用户列表
   */
  async getAllUser() {
    const { ctx } = this
    let { page } = ctx
    const { common } = ctx.service.v1
    console.log(page)
    page = {
      ...page,
      pageField: 'id',
      pageSort: 'DESC'
    }
    const [total, items] = await Promise.all([
      common.findCount({ modelName: 'User' }),
      common.findPage({ modelName: 'User', page }),
    ])
    const res = { total, items, pageSize: page.pageSize, pageIndex: page.pageIndex }
    ctx.helper.success({ ctx, res: res })
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo() {
    const { ctx } = this
    const { user } = ctx.service.v1
    const usert = ctx.request.body
    ctx.validate({
      id: { type: 'number', required: true },
      email: { type: 'string', required: true },
      password: { type: 'string', required: true }
    }, usert)
    usert.password = ctx.helper.bhash(usert.password)
    const result = await user.update(usert)
    ctx.helper.success({ ctx, res: result })
  }

  /**
   * 删除用户
   */
  async deleteUserById() {
    const { ctx } = this
    const { user } = ctx.service.v1
    const userData = ctx.request.body
    ctx.validate({
      id: { type: 'number', required: true }
    }, userData)
    const result = await user.deleteById(userData.id)
    if (result !== 0) {
      ctx.helper.success({ ctx, res: '用户删除成功' })
    } else {
      ctx.helper.fail({ ctx, res: '用户删除失败' })
    }
  }

  /**
   * 获取用户日志
   */
  async getUserLog() {
    const { ctx, app } = this
    let { page } = ctx
    const { common } = ctx.service.v1
    console.log(page)
    page = {
      ...page,
      pageField: 'id',
      pageSort: 'DESC'
    }
    const [total, items] = await Promise.all([
      common.findCount({ modelName: 'Log' }),
      common.findPage({ modelName: 'Log', page }),
    ])
    const res = { total, items, pageSize: page.pageSize, pageIndex: page.pageIndex }
    ctx.helper.success({ ctx, res: res })
  }

  /**
   * 删除一个月前日志
   */
  async delLogBeforeMonth () {
    const { ctx } = this
    const { log } = ctx.service.v1
    const res = await log.delBeforeMonth()
    if (res) {
      ctx.helper.success({ ctx, res: res})
    } else {
      ctx.helper.fail({ ctx, res: '删除日志失败' })
    }
  }

  /**
   * 发送重置密码的验证码邮件
   */
  async sentResetPassCode() {
    const { ctx } = this
    const { user, cache, email } = ctx.service.v1
    const { temail } = ctx.request.body
    const tuser = await user.findByEmail(temail)
    if(!tuser) {
      ctx.helper.fail({ctx, res:'此邮箱未注册'})
    }
    // 生成缓存key值
    const key = 'password' + tuser.id
    // 从缓存中查看用户是否点击过请求邮件
    const hasCode = cache.has(key)
    if (hasCode) {
      ctx.helper.fail({ctx, res:'请勿重复发送'})
    }
    // 生成验证码
    const code = cache.verifyCodeCache(key, 6)
    // 发送重置邮件
    const rs = await email.resetPassword(code, tuser)
    if(rs && rs.messageId) {
      ctx.helper.success({ctx, res:'验证码发送成功! 请注意查收!'})
    } else {
      ctx.helper.fail({ctx, res:'发送验证码失败! 请重试!'})
    }
  }

    /**
   * 重置密码
   */
  async resetPassword () {
    const { ctx } = this
    const { user, cache } = ctx.service.v1
    const { temail, password, verifyCode } = ctx.request.body
    const tuser = await user.findByEmail(temail)
    if(!tuser) {
      ctx.helper.fail({ctx, res:'此邮箱未注册！'})
    }
    const key = 'password_' + tuser.id
    const currentCode = cache.get(key)
    if(currentCode !== verifyCode){
      ctx.logger.info('verifyCode error')
      ctx.helper.fail({ctx, res:'验证码错误'})
    }
    const rs = await user.update({
      password: password
    }, tuser.id)
    if(!rs) {
      ctx.helper.fail({ctx, res:'修改失败'})
    }
    cache.del(key)
    ctx.helper.success({ctx, res:'修改成功'})
  }

  /**
   * 保存用户操作记录
   */
  async updateCtrl() {
    const { ctx } = this
    const { log } = ctx.service.v1
    const data = ctx.request.body
    ctx.validate({
      ctrlData: { type: 'string', required: true }
    }, data)
    const res = log.updateLogCtrl(data.ctrlData)
    if (res) {
      ctx.helper.success({ctx, res:'更新成功'})
    } else {
      ctx.helper.fail({ctx, res:'更新失败'})
    }
  }

  /**
   * 获取用于生成登录二维码的guid
   */
  async getLoginQrcode() {
    const { ctx } = this
    const { user: userService } = ctx.service.v1
    const result = await userService.genLoginQrcode()
    if (result) {
      ctx.helper.success({ctx, res: result, msg: '二维码获取成功'})
    } else {
      ctx.helper.success({ctx, res: result, msg: '二维码获取失败'})
    }
  }

  /**
   * 小程序扫码, 判断二维码是否可用, 以及登录操作
   */
  async checkLoginQrcode() {
    const { ctx } = this
    const { user: userService, log } = ctx.service.v1
    const body = ctx.request.body
    ctx.validate({
      guid: { type: 'string', required: true },
      openId: { type: 'string', required: true }
    }, body)
    const result = await userService.checkLoginQrcode(body.guid, body.openId)
    if (typeof result === 'object') {
      log.addLog({
        admin: result.username,
        ip: '微信',
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        comment: result.role + '扫码登录'
      })
      ctx.helper.success({ctx, res: result, msg: '登录成功'})
    } else if (result === '1111') {
      ctx.helper.success({ctx, res: result, msg: '未绑定用户'})
    } else if (result === '2222') {
      ctx.helper.success({ctx, res: result, msg: '二维码失效'})
    } else if (result === '3333') {
      ctx.helper.success({ctx, res: result, msg: '已扫码, 但未绑定用户'})
    }
  }

  /**
   * 获取二维码状态
   */
  async checkLoginQrcodeStatus() {
    const { ctx } = this
    const { user: userService } = ctx.service.v1
    const body = ctx.request.query
    ctx.validate({
      guid: { type: 'string', required: true }
    }, body)
    const status = await userService.checkLoginQrcodeStatus(body.guid)
    if (typeof status === 'object') {
      ctx.helper.success({ctx, res: {
        status: '0000',
        info: status
      }, msg: '登录成功'})
    } else if (status === false) {
      ctx.helper.success({ctx, res: {
        status: '1111'
      }, msg: '未检测到状态'})
    } else if (status === 'invalid') {
      ctx.helper.success({ctx, res: {
        status: '2222'
      }, msg: '二维码无效'})
    } else if (status === 'scan') {
      ctx.helper.success({ctx, res: {
        status: '3333'
      }, msg: '已扫码, 但未绑定用户'})
    }
  }
}

module.exports = UserController