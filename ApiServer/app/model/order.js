'use strict';

/*
  用户订单列表
  id:          id
  order_id:    订单id
  alipay_id:   支付宝订单id
  user_id:     用户id
  total_price: 物品价格
  product:     物品名称
  number:      物品数量
  info:        订单描述
  address:     收货地址
  mobile:      联系人电话
  status:      支付状态
  buyer_id:    买家id
  seller_id:   卖家id
*/
module.exports = app => {
  const { FLOAT, INTEGER, STRING } = app.Sequelize;

  const Order = app.model.define('order', {
    id: {
      type: INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
    },
    order_id: {
      type: STRING,
      unique: true,
      allowNull: false,
    },
    alipay_id: {
      type: STRING,
      allowNull: true,
    },
    product: {
      type: STRING,
      allowNull: false,
    },
    info: {
      type: STRING,
      allowNull: true,
    },
    number: {
      type: INTEGER,
      allowNull: false,
    },
    total_price: {
      type: FLOAT,
      allowNull: false,
    },
    address: {
      type: STRING,
      allowNull: false,
    },
    mobile: {
      type: INTEGER,
      allowNull: false,
    },
    status: {
      type: STRING,
      allowNull: false,
    },
    buyer_id: {
      type: STRING,
      allowNull: true,
    },
    seller_id: {
      type: STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
    tableName: 'order',
    underscored: false,
  });

  Order.associate = function() {
    app.model.Order.belongsTo(app.model.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'the_order',
    });
  };

  return Order;
};
