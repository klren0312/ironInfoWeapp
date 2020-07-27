'use strict';

/*
  文章表
  title:      标题
  content:    内容
  status:     启用状态
*/

module.exports = app => {
  const { STRING, TEXT, BOOLEAN } = app.Sequelize;

  const Article = app.model.define('article', {
    title: {
      type: STRING,
      allowNull: false,
    },
    content: {
      type: TEXT,
      allowNull: true,
    },
    content: {
      type: TEXT,
      allowNull: true,
    },
    status: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    timestamps: true,
    tableName: 'article',
  });
  return Article;
};
