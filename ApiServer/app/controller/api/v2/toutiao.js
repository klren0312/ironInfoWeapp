'use strict';

const Controller = require('egg').Controller;

class ToutiaoController extends Controller {
  /**
   * 检测敏感词
   */
  async checkText() {
    const { ctx } = this;
    const { toutiao } = ctx.service.v2;
    ctx.validate({
      text: { type: 'string', required: true },
    }, ctx.params);
    const { text } = ctx.params;
    const result = await toutiao.checkTextSecurity(text);
    const check = result.data.data[0].predicts[0].prob;
    // 检测结果-置信度-概率，值为 0 或者 1，
    // 当值为 1 时表示检测的文本包含违法违规内容
    if (check === 1) {
      ctx.helper.fail({ ctx, res: { check }, msg: '搜索内容含有敏感词!' });
    } else {
      ctx.helper.success({ ctx, res: { check }, msg: '搜索内容不含有敏感词' });
    }
  }
}

module.exports = ToutiaoController;
