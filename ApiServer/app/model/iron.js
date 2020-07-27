'use strict';

/*
  钢材表
  id:         钢材id
  name:       钢材名称
  intro:      钢材简介
  photo:      钢材照片
  new_price:  钢材最新价格
*/
module.exports = app => {
  const { STRING, TEXT, FLOAT, INTEGER } = app.Sequelize;
  const Iron = app.model.define('iron', {
    id: {
      type: INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: STRING,
      unique: true,
      allowNull: false,
    },
    intro: {
      type: TEXT,
      allowNull: true,
    },
    photo: {
      type: STRING,
      allowNull: true,
    },
    new_price: {
      type: FLOAT,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'iron',
    underscored: false,
  });
  Iron.associate = function() {
    app.model.Iron.hasMany(app.model.Price, {
      foreignKey: 'iron_id',
      sourceKey: 'id',
      as: 'old_price',
    });
  };
  return Iron;
};
