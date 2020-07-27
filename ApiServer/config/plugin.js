'use strict';

// had enabled by egg
exports.static = true;

// Sequelize插件
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

// 校验插件
exports.validate = {
  enable: true,
  package: 'egg-validate',
};

// jwt插件
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};

// 子路由
exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus',
};

// 跨域
exports.cors = {
  enable: true,
  package: 'egg-cors',
};

// redis
exports.redis = {
  enable: true,
  package: 'egg-redis',
};

// nunjucks模板
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

// casbin权限
exports.zrole = {
  enable: true,
  package: 'egg-zrole',
};
