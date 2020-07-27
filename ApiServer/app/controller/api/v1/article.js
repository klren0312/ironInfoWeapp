'use strict'

const Controller = require('egg').Controller

class ArticleController extends Controller {
  /** 
   * 新建文章
   */
  async createArticle() {
    const { ctx } = this
    const { article } = ctx.service.v1
    const articleInfo = ctx.request.body
    ctx.validate({
      title: { type: 'string', require: true }
    }, articleInfo)
    const result = await article.create(articleInfo)
    if (result) {
      ctx.status = 201
      ctx.helper.success({ ctx, res: '录入成功' })
    } else {
      ctx.helper.fail({ ctx, res: '录入失败' })
    }
  }

  /**
   * 删除文章
   */
  async deleteArticle() {
    const { ctx } = this
    const { article } = ctx.service.v1
    const articleInfo = ctx.request.body
    ctx.validate({
      id: { type: 'number', require: true }
    }, articleInfo)
    const result = await article.deleteById(articleInfo.id)
    if (result !== 0) {
      ctx.helper.success({ ctx, res: '删除成功' })
    } else {
      ctx.helper.fail({ ctx, res: '删除失败' })
    }
  }

  /**
   * 通过id获取文章
   */
  async getArticleById() {
    const {ctx} = this
    const {article} = ctx.service.v1
    const id = ctx.request.query.id
    const result = await article.getById(parseInt(id))
    if(result) {
      ctx.helper.success({ ctx, res: result })
    } else {
      ctx.helper.fail({ ctx, res: '获取失败' })
    }
  }

  /**
   * 通过id更新文章
   */
  async updateArticleById() {
    const {ctx} = this
    const {article} = ctx.service.v1
    const articleInfo = ctx.request.body
    ctx.validate({
      id: { type: 'number', require: true },
      title: {type: 'string', require: true},
      content: {type: 'string', require: true}
    }, articleInfo)
    const result = await article.updateById(articleInfo)
    if(result) {
      ctx.helper.success({ ctx, res: '更新成功' })
    } else {
      ctx.helper.fail({ ctx, res: '更新失败' })
    }
  }
  /**
   * 禁用启用文章
   */
  async enableOrDisable() {
    const {ctx} = this
    const {article} = ctx.service.v1
    const articleInfo = ctx.request.body
    ctx.validate({
      id: { type: 'number', require: true },
      status: { type: 'boolean', require: true }
    }, articleInfo)
    const result = await article.changeStatusById(articleInfo)
    if(result) {
      if(articleInfo.status) {
        ctx.helper.success({ctx, res: '启用成功'})
      } else {
        ctx.helper.success({ctx, res: '禁用成功'})
      }
    } else {
      ctx.helper.fail({ ctx, res: '操作失败' })
    }
  }
  /**
   * 获取文章列表
   */
  async getArticleList() {
    const { ctx } = this
    let { page } = ctx
    const { common } = ctx.service.v1
    const search = ctx.request.query
    let where = {}
    if(search.hasOwnProperty('id')&& search.id !== '') {
      where.id = parseInt(search.id)
    }
    if(search.hasOwnProperty('status')&& search.status !== '') {
      try {
        where.status = eval(search.status)
      } catch (error) {
        ctx.logger.error(error)
      }
    }
    page = {
      ...page,
      pageField: 'id',
      pageSort: 'DESC'
    }

    const [total, items] = await Promise.all([
      common.findCount({ modelName: 'Article' }),
      common.findPage({
        modelName: 'Article',
        page,
        where
      })
    ])
    const res = { total, items, pageSize: page.pageSize, pageIndex: page.pageIndex }
    ctx.helper.success({ ctx, res: res })
  }
}


module.exports = ArticleController