'use strict';

module.exports = {
  /**
   * 子路由
   */
  get apiV1Router() {
    return this.router.namespace('/api/v1');
  },
  get apiV2Router() {
    return this.router.namespace('/api/v2');
  },
  /**
   * 生成jwt
   * @param {Int} id 用户id
   * @param {String} username 用户名
   * @param {String} role 权限
   */
  generateJWT(id, username, role) {
    const { config } = this;
    const token = this.jwt.sign({ id, username, role }, config.jwt.secret, {
      expiresIn: '2 days',
    });
    return token;
  },

  /**
   * 验证jwt
   * @param {Object} ctx 传入的请求体
   */
  verifyToken(ctx) {
    const { config } = this;
    const token = config.jwt.getToken(ctx);
    if (!token) return null;
    return this.jwt.verify(token, config.jwt.secret);
  },

  /**
   * 获取用户信息
   * @param {Object} user 用户信息
   * @param {Object} ctx 请求体
   * @param {Int} check 1: 登录, 2: 注册
   * @return {Object} 用户登录/注册反馈
   */
  getUserJson(user, ctx, check) {
    user = user.get();
    const { config } = this;
    let token = config.jwt.getToken(ctx);
    if (check === 1) {
      if (!token) {
        token = 'Bearer ' + this.generateJWT(user.id, user.username, user.role);
      }
      return {
        token,
        username: user.username,
        roles: user.role,
      };
    } else if (check === 0) {
      return {
        username: user.username,
        email: user.email,
      };
    }
    return { error: '联系管理员吧' };

  },
  // 保存全局的用户wechat数据
  wechatQueue: {},
  // 用户批量添加好友的队列。
  wechatAddContactQueue: [],
};
