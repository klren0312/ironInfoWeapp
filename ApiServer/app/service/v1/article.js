'use strict';
const Service = require('egg').Service;

class ArticleService extends Service {
  /**
   * 创建文章
   * @param {Object} article 文章标题, 内容
   * @return {Object} 结果
   */
  async create(article) {
    return await this.ctx.model.Article.create(article);
  }

  /**
   * 删除文章
   * @param {Number} id 文章id
   * @return {Object} 结果
   */
  async deleteById(id) {
    return await this.ctx.model.Article.destroy({ where: { id } });
  }

  /**
   * 通过id获取文章
   * @param {Number} id 文章id
   * @return {Object} 文章
   */
  async getById(id) {
    const article = await this.ctx.model.Article.findOne({
      where: {
        id,
      },
    });
    if (!article) {
      this.ctx.throw(404, 'article not found');
    }
    return article;
  }

  /**
   * 更新文章
   * @param {Object} article 文章对象
   * @return {Object} 结果
   */
  async updateById(article) {
    const { id } = article;
    delete article.id;
    return await this.ctx.model.Article.update(article, {
      where: {
        id,
      },
    });
  }

  /**
   * 修改文章状态
   * @param {Object} article
   * @return {Object} 结果
   */
  async changeStatusById(article) {
    const { id, status } = article;
    return await this.ctx.model.Article.update(
      { status },
      {
        where: {
          id,
        },
      }
    );
  }
}

module.exports = ArticleService;
