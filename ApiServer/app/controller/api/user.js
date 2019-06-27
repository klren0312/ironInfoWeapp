'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  /**
   * 用户登录
   */
  async login() {
    const { ctx, app } = this
    const { user } = ctx.service
    const { password, username } = ctx.request.body
    ctx.validate({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true }
    }, ctx.request.body)
    const result = await user.findByUsername(username)
    if (!ctx.helper.bcompare(password, result.password)) {
      ctx.helper.fail({ ctx, res: '用户密码错误' })
      return
    }
    ctx.helper.success({ ctx, res: app.getUserJson(result, ctx, 1) })
  }

  /**
   * 用户注册
   */
  async register() {
    const { ctx, app } = this
    const { user } = ctx.service
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
   * 查询所有用户,用户列表
   */
  async getAllUser() {
    const { ctx } = this
    let { page } = ctx
    const { common } = ctx.service
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
    const { user } = ctx.service
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
    const { user } = ctx.service
    const user = ctx.request.body
    ctx.validate({
      id: { type: 'number', required: true }
    }, user)
    const result = await user.deleteById(user.id)
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
    const { common } = ctx.service
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
   * 发送重置密码的验证码邮件
   */
  async sentResetPassCode() {
    const { ctx } = this
    const { user, cache, email } = ctx.service
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
    const { user, cache } = ctx.service
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
}

module.exports = UserController