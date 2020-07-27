'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { STRING, DATE, TEXT, INTEGER } = Sequelize;

    return queryInterface.createTable('log', {
      id: {
        type: INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      admin: {
        type: STRING(11),
        allowNull: false,
      },
      ip: {
        type: STRING(30),
        allowNull: true,
      },
      comment: {
        type: STRING(30),
        allowNull: true,
      },
      time: {
        type: DATE,
        allowNull: true,
      },
      location: {
        type: STRING(233),
        allowNull: true,
      },
      ctrl: {
        type: TEXT,
        allowNull: true,
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
    return queryInterface.dropTable('log');
  },
};
