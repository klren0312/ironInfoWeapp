'use strict';

module.exports = app => {
  const { controller, apiV2Router } = app;

  // 检查敏感词
  apiV2Router.get('/toutiao/text/:text', controller.api.v2.toutiao.checkText);

};
