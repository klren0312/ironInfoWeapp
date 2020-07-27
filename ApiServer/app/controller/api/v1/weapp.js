'use strict';

const Controller = require('egg').Controller;

class WeappController extends Controller {

  /**
   * 获取钢材列表
   */
  async getAllIron() {
    const { ctx } = this;
    const { iron } = ctx.service.v1;
    const result = await iron.getAllIron();
    ctx.helper.success({ ctx, res: result });
  }

  /**
   * 通过名称搜索钢材
   */
  async getIronByName() {
    const { ctx } = this;
    const { iron } = ctx.service.v1;
    const search = ctx.request.query;
    const result = await iron.getIronByName(search);
    if (result && result.length > 0) {
      ctx.helper.success({ ctx, res: result });
    } else {
      ctx.helper.fail({ ctx, res: '暂无搜索结果' });
    }
  }

  /**
   * 获取钢材选择项
   * id, name
   */
  async getIronSelectList() {
    const { ctx } = this;
    const { iron } = ctx.service.v1;
    const search = ctx.request.query;
    const result = await iron.getIronSelectList(search);
    if (result && result.length > 0) {
      ctx.helper.success({ ctx, res: result });
    } else {
      ctx.helper.fail({ ctx, res: '暂无搜索结果' });
    }
  }


  /**
   * 获取小程序官方的key
   * @param {String} code 小程序wx.login获取的code
   */
  async getSessionKey(code) {
    const { app } = this;
    const appid = app.config.wechat.tlgc.appId;
    const secret = app.config.wechat.tlgc.secret;
    const grant_type = 'authorization_code';
    const wecode = code;
    // 登录接口地址
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${wecode}&grant_type=${grant_type}`;
    // 请求登录接口
    const result = await this.app.curl(url, {
      dataType: 'json',
    });
    return result.data;
  }

  /**
   * 微信小程序登录
   */
  async login() {
    const { ctx, app } = this;
    const { crypted, iv, signature, code } = ctx.request.body;
    const key = await this.getSessionKey(code);
    const { openid, session_key } = key;
    // 加密session_key 传给客户端
    // let skey = ctx.helper.encryptSha1(session_key)
    // 解密用户信息，可以将其存入数据库
    const decode = ctx.helper.decodeUserInfo(session_key, iv, crypted);
    delete decode.watermark;
    ctx.service.v1.wuser.saveInfo(decode);
    const token = 'Bearer ' + app.generateJWT(decode.openId, decode.nickName);
    ctx.body = {
      token,
      openId: openid,
    };
  }
}

module.exports = WeappController;
