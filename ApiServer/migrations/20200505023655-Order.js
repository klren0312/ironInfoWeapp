'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { FLOAT, INTEGER, STRING } = Sequelize;
    return queryInterface.createTable('order', {
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
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('order');
  },
};
