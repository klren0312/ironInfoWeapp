'use strict';

const Controller = require('egg').Controller;

class UploadController extends Controller {
  async index() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    ctx.helper.success({ ctx, res: 'upload ok' + stream });
  }
}

module.exports = UploadController;
