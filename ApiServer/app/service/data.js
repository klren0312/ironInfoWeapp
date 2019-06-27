'use strict';
const dayjs = require('dayjs')
let Parser = require('rss-parser');
let parser = new Parser();
const Service = require('egg').Service;
const wechat = {
  url: 'https://api.weixin.qq.com',
  appId: '',
  secret: ''
}

class DataService extends Service {
  /**
   * 获取token
   */
  async getWechatToken() {
    const {ctx, app} = this
    let result = await ctx.helper.request({ctx, url: `${wechat.url}/cgi-bin/token?grant_type=client_credential&appid=${wechat.appId}&secret=${wechat.secret}`})
    console.log('token', result.data)
    app.redis.set('weToken', result.data.access_token, 'EX', result.data.expires_in)
    return result.data.access_token
  }

  /**
   * 获取用户画像
   */
  async getWechatUser() {
    const {ctx, app} = this
    const yesterday = dayjs().subtract(1, 'day').format("YYYYMMDD")
    let token = await app.redis.get('token');
    if(token && token !== '') {
      const result = await ctx.helper.request({
        ctx, 
        url: `${wechat.url}/datacube/getweanalysisappiduserportrait?access_token=${token}`,
        method: 'POST',
        data: {
          begin_date: yesterday,
          end_date: yesterday
        }
      })
      return result
    } else {
      token = await ctx.service.data.getWechatToken()
      const result = await ctx.helper.request({
        ctx, 
        url: `${wechat.url}/datacube/getweanalysisappiduserportrait?access_token=${token}`,
        method: 'POST',
        data: {
          begin_date: yesterday,
          end_date: yesterday
        }
      })
      return result
    }
  }

  /**
   * 获取文章总数, 钢材总数, 访问用户
   */
  async getHomeSum() {
    const { ctx, app } = this
    const { common } = ctx.service
    const [article_sum, iron_sum, wuser_sum] = await Promise.all([
      common.findCount({ modelName: 'Article'}),
      common.findCount({ modelName: 'Iron'}),
      common.findCount({ modelName: 'Wuser'})
    ])
    // console.log('==========================')
    // console.log(wuser_sum)
    return {
      article_sum,
      iron_sum,
      wuser_sum
    }
  }

  /**
   * 获取新闻
   */
  async getNews(url) {
    let result = await parser.parseURL( `http://rss.zzes1314.cn${url}`)
    console.log(result)
    return result
  }

  /**
   * 获取天气
   */
  async getWeather() {
    const {ctx} = this
    const result = await ctx.helper.request({
      ctx, 
      url: `https://api.seniverse.com/v3/weather/now.json?key=4mji5aocvnj6nvbo&location=tongling&language=zh-Hans&unit=c`,
      method: 'GET'
    })
    return result
  }
  
}

module.exports = DataService;
