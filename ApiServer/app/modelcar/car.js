'use strict';

/*
  汽车表
  name:         名称
  price:        价格
  displacement: 排量
  level:        级别
  type:         类型
  gearbox:      变速箱
  img:          图片
*/

module.exports = app => {
  const { STRING } = app.Sequelize;

  const Car = app.modelcar.define('car', {
    name: {
      type: STRING,
      allowNull: false,
    },
    price: {
      type: STRING,
      allowNull: false,
    },
    displacement: {
      type: STRING,
      allowNull: false,
    },
    level: {
      type: STRING,
      allowNull: false,
    },
    type: {
      type: STRING,
      allowNull: false,
    },
    gearbox: {
      type: STRING,
      allowNull: false,
    },
    img: {
      type: STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'car',
  });
  return Car;
};
