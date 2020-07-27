'use strict'

const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')

class PageController extends Controller {
  async clone() {
    const { ctx } = this
    await ctx.render('clone.html', {
      current: 'clone'
    })
  }
  async index() {
    const { ctx } = this
    await ctx.render('index.html', {
      current: 'index'
    })
  }

  async irons() {
    const { ctx } = this
    ctx.response.type = 'html'
    ctx.body = fs.readFileSync(path.resolve(__dirname, '../../public/tlgc/index.html'))
  }

  async map() {
    const { ctx } = this
    const { location } = ctx.service.v1
    let result = await location.getCurrentLocation()
    await ctx.render('map.html', {
      current: 'map',
      location: result[0]
    })
  }

  async m3u8() {
    const { ctx } = this
    await ctx.render('m3u8.html', {
      current: 'm3u8'
    })
  }

  async cars() {
    const { ctx } = this
    let { page } = ctx
    const { common } = ctx.service.v1
    const query = ctx.query
    let where = {}
    page = {
      ...page,
      pageField: 'id',
      pageSort: 'DESC'
    }
    const include = []
    const [total, items] = await Promise.all([
      common.findCount({ dataModel: 'modelcar', modelName: 'Car' }),
      common.findPage({
        dataModel: 'modelcar',
        modelName: 'Car',
        page,
        include,
        where
      })
    ])
    const res = { total, items, pageSize: page.pageSize, pageIndex: page.pageIndex }
    await ctx.render('cars.html', {
      cars: res.items,
      current: 'cars',
      prev: res.pageIndex - 1,
      next: res.pageIndex + 1,
      total: res.total,
      last: res.total / res.pageSize + (res.total % res.pageSize > 0 ? 1 : 0)
    })
  }
}

module.exports = PageController
