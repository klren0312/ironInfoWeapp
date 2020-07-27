'use strict';

const Service = require('egg').Service;
const Redis = require('ioredis');
const redis = new Redis({
  db: 5,
});
const TTTOKEN = 'ttToken';

class ToutiaoService extends Service {
  /**
   * 获取token
   */
  async getToken() {
    const { ctx, app } = this;
    const result = await ctx.helper.request({ ctx, url: `https://developer.toutiao.com/api/apps/token?appid=${app.config.toutiao.tlgc.appId}&secret=${app.config.toutiao.tlgc.secret}&grant_type=client_credential` });
    ctx.logger.info(TTTOKEN, result.data);
    redis.set(TTTOKEN, result.data.access_token, 'EX', result.data.expires_in);
    return result.data.access_token;
  }

  /**
   * 敏感词检测
   * @param {String} text 待检测的字符串
   */
  async checkTextSecurity(text) {
    const { ctx, app } = this;
    let token = await redis.get(TTTOKEN);
    if (token && token !== '') {
      return await getResult(token, text);
    }
    token = await ctx.service.v2.toutiao.getToken();
    return await getResult(token, text);

    async function getResult(token, text) {
      const result = await ctx.helper.request({
        ctx,
        url: 'https://developer.toutiao.com/api/v2/tags/text/antidirt',
        headers: {
          'X-Token': token,
        },
        data: {
          tasks: [
            {
              content: text,
            },
          ],
        },
        method: 'POST',
      });
      return result;
    }
  }
}

module.exports = ToutiaoService;
