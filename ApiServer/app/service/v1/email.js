'use strict';

const nodemailer = require('nodemailer');
const Service = require('egg').Service;

class EmailService extends Service {
  constructor(...args) {
    super(...args);
    this.transporter = nodemailer.createTransport(this.app.config.transporter);
  }

  /**
   * 发送email
   * @param {String} to 接收邮件的人
   * @param {String} subject 主题
   * @param {String} html 内容
   */
  sent(to, subject, html) {
    const { auth, appName } = this.config.transporter;
    const mailOptions = {
      from: `${appName} <${auth.user}>`,
      to,
      subject,
      html,
    };

    return this.transporter.sendMail(mailOptions).catch(error => {
      this.ctx.logger.info('Message %s sent error: %s', error);
      return error;
    });
  }

  /**
   * 重设密码 通过验证码
   * @param {String} verifyCode 验证码
   * @param {Object} user 用户
   * @return {Object} 邮件相关信息
   */
  resetPassword(verifyCode, user) {
    const html = `
      <strong>重设密码</strong>
      <p>账户名：${user.username}</p>
      <p>验证码：${verifyCode}</p>
    `;

    return this.sent(user.email, '治电普钢找回密码', html);
  }
}

module.exports = EmailService;
