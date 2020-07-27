'use strict';


/*
  请求路径
  id     id
  path   路径
  times  请求次数
*/
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Path = app.model.define('path', {
    id: {
      type: INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    path: {
      type: STRING,
      allowNull: false,
    },
    times: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
    tableName: 'path',
    underscored: false,
  });
  return Path;
};
