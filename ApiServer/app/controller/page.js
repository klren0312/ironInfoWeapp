'use strict';

const Controller = require('egg').Controller;

class PageController extends Controller {
  async name() {
    const { ctx } = this
    await ctx.render('page.html', {name: 'klkl'})
  }
}

module.exports = PageController;
