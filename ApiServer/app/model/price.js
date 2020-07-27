'use strict';


/*
  钢材历史价格表
  id:         价格id
  iron_id:    钢材id
  price:      钢材历史价格
  staus:      启用状态
*/
module.exports = app => {
  const { FLOAT, INTEGER, BOOLEAN } = app.Sequelize;

  const Price = app.model.define('price', {
    id: {
      type: INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    iron_id: {
      type: INTEGER,
      allowNull: false,
    },
    price: {
      type: FLOAT,
      allowNull: false,
    },
    status: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    timestamps: true,
    tableName: 'price',
    underscored: false,
  });

  Price.associate = function() {
    app.model.Price.belongsTo(app.model.Iron, {
      foreignKey: 'iron_id',
      targetKey: 'id',
      as: 'the_iron',
    });
  };

  return Price;
};
