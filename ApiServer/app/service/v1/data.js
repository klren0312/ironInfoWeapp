'use strict';
const dayjs = require('dayjs');
const Parser = require('rss-parser');
const parser = new Parser();
const Redis = require('ioredis');
const redis = new Redis({
  db: 4,
});
const Service = require('egg').Service;

const WETOKEN = 'weToken';

class DataService extends Service {
  /**
   * 获取token
   */
  async getWechatToken() {
    const { ctx, app } = this;
    const result = await ctx.helper.request({ ctx, url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${app.config.wechat.tlgc.appId}&secret=${app.config.wechat.tlgc.secret}` });
    ctx.logger.info(WETOKEN, result.data);
    redis.set(WETOKEN, result.data.access_token, 'EX', result.data.expires_in);
    return result.data.access_token;
  }

  /**
   * 获取用户画像
   */
  async getWechatUser() {
    const { ctx, app } = this;
    const yesterday = dayjs().subtract(1, 'day').format('YYYYMMDD');
    let token = await redis.get(WETOKEN);
    if (token && token !== '') {
      const result = await ctx.helper.request({
        ctx,
        url: `https://api.weixin.qq.com/datacube/getweanalysisappiduserportrait?access_token=${token}`,
        method: 'POST',
        data: {
          begin_date: yesterday,
          end_date: yesterday,
        },
      });
      return result;
    }
    token = await ctx.service.v1.data.getWechatToken();
    const result = await ctx.helper.request({
      ctx,
      url: `https://api.weixin.qq.com/datacube/getweanalysisappiduserportrait?access_token=${token}`,
      method: 'POST',
      data: {
        begin_date: yesterday,
        end_date: yesterday,
      },
    });
    return result;

  }

  /**
   * 获取小程序广告列表
   */
  async getAdList() {
    const { ctx } = this;
    const list = await redis.get('adlist');
    if (list && list !== '') {
      return JSON.parse(list);
    }
    let token = await redis.get(WETOKEN);
    if (token && token !== '') {
      const result = await ctx.helper.request({
        ctx,
        url: `https://api.weixin.qq.com/publisher/stat?action=get_adunit_list&access_token=${token}`,
        method: 'GET',
      });
      redis.set('adlist', JSON.stringify(result));
      return result;
    }
    token = await ctx.service.v1.data.getWechatToken();
    const result = await ctx.helper.request({
      ctx,
      url: `https://api.weixin.qq.com/publisher/stat?action=get_adunit_list&access_token=${token}`,
      method: 'GET',
    });
    redis.set('adlist', JSON.stringify(result));
    return result;

  }

  /**
   * 获取banner广告详情
   */
  async getAdDetails() {
    const { ctx } = this;
    const details = await redis.get('adDetails');
    if (details && details !== '') {
      return JSON.parse(details);
    }
    let token = await redis.get(WETOKEN);
    const startDate = '2019-08-01';
    const endDate = dayjs().format('YYYY-MM-DD');
    if (token && token !== '') {
      const result = await ctx.helper.request({
        ctx,
        url: `https://api.weixin.qq.com/publisher/stat?action=publisher_adpos_general&access_token=${token}&start_date=${startDate}&end_date=${endDate}&slot_id=8040321819858439`,
        method: 'GET',
      });
      redis.set('adDetails', JSON.stringify(result), 'EX', 60 * 60 * 24);
      return result;
    }
    token = await ctx.service.v1.data.getWechatToken();
    const result = await ctx.helper.request({
      ctx,
      url: `https://api.weixin.qq.com/publisher/stat?action=publisher_adpos_general&access_token=${token}&start_date=${startDate}&end_date=${endDate}&slot_id=8040321819858439`,
      method: 'GET',
    });
    redis.set('adDetails', JSON.stringify(result), 'EX', 60 * 60 * 24);
    return result;

  }

  /**
   * 获取文章总数, 钢材总数, 访问用户
   */
  async getHomeSum() {
    const { ctx, app } = this;
    const { common } = ctx.service.v1;
    const [ article_sum, iron_sum, wuser_sum ] = await Promise.all([
      common.findCount({ modelName: 'Article' }),
      common.findCount({ modelName: 'Iron' }),
      common.findCount({ modelName: 'Wuser' }),
    ]);
    // console.log('==========================')
    // console.log(wuser_sum)
    return {
      article_sum,
      iron_sum,
      wuser_sum,
    };
  }

  /**
   * 获取新闻
   */
  async getNews(url) {
    const result = await parser.parseURL(`http://rss.zzes1314.cn${url}`);
    console.log(result);
    return result;
  }

  /**
   * 获取天气
   */
  async getWeather() {
    const { ctx } = this;
    const result = await ctx.helper.request({
      ctx,
      url: 'https://api.seniverse.com/v3/weather/now.json?key=4mji5aocvnj6nvbo&location=tongling&language=zh-Hans&unit=c',
      method: 'GET',
    });
    return result;
  }

}

module.exports = DataService;
