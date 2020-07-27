'use strict';

/*
  热门钢材表
  id:         热门钢材id
  ironId:     钢材id
  name:       钢材名称
  icon:       钢材icon
  sort:       排序
*/
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const Hot = app.model.define('hot', {
    id: {
      type: INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    ironId: {
      type: INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: STRING,
      unique: true,
      allowNull: false,
    },
    icon: {
      type: STRING,
      allowNull: true,
    },
    sort: {
      type: INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: true,
    tableName: 'hot',
    underscored: false,
  });

  return Hot;
};
