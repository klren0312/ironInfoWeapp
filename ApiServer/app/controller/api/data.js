'use strict';

const Controller = require('egg').Controller;

class DataController extends Controller {
  /**
   * 获取微信token
   */
  async getToken() {
    const {ctx} = this
    const { data } = ctx.service
    let result = await data.getWechatToken()
    ctx.body = result
  }

  /**
   * 获取用户画像
   */
  async getWechatUser() {
    const {ctx} = this
    const { data } = ctx.service
    let result = await data.getWechatUser()
    if(result) {
      ctx.helper.success({ctx, res: result.data.visit_uv })
    } else {
      ctx.helper.fail({ctx, res: '暂无数据' })
    }
  }

  /**
   * 获取文章, 钢材统计, 访问用户数据
   */
  async getHomeSum() {
    const {ctx} = this
    const { data } = ctx.service
    let result = await data.getHomeSum()
    let adList = await data.getAdList()
    let totalPrice = await data.getAdDetails()
    if(JSON.stringify(result) !== '{}') {
      ctx.helper.success({ctx, res: {
        ...result,
        ad_list: adList.data.ad_unit,
        total_price: totalPrice.data.summary
      }})
    } else {
      ctx.helper.fail({ctx, res: {
        article_num: 0,
        iron_sum: 0,
        wuser_sum: 0,
        ad_list: [],
        total_price: 0
      }})
    }
  }

  /**
   * 新闻
   */
  async getNews() {
    const {ctx} = this
    const {data} = ctx.service
    const url = ctx.request.body.url
    let result = await data.getNews(url)
    if(result) {
      ctx.helper.success({ctx, res: result})
    } else {
      ctx.helper.fail({ctx, res: []})
    }
  }

  /**
   * 获取天气
   */
  async getWeather() {
    const {ctx} = this
    const {data} = ctx.service
    let result = await data.getWeather()
    console.log(result)
    ctx.helper.success({ctx, res: result.data.results})
  }
}

module.exports = DataController;
