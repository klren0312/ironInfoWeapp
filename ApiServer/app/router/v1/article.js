'use strict';

module.exports = app => {
  const { controller, middleware, apiV1Router } = app;

  // 添加文章
  apiV1Router.post('/article', app.jwt, middleware.log, controller.api.v1.article.createArticle);

  // 删除文章
  apiV1Router.delete('/article', app.jwt, middleware.log, controller.api.v1.article.deleteArticle);

  // 文章列表
  apiV1Router.get('/article', app.jwt, middleware.pagination, controller.api.v1.article.getArticleList);

  // 更新文章
  apiV1Router.put('/article', app.jwt, middleware.log, controller.api.v1.article.updateArticleById);

  // 修改文章状态
  apiV1Router.patch('/article', app.jwt, middleware.log, controller.api.v1.article.enableOrDisable);
};
