'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { FLOAT, INTEGER, DATE, BOOLEAN } = Sequelize;
    return queryInterface.createTable('price', {
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
      createdAt: DATE,
      updatedAt: DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('price');
  },
};
