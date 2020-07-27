'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { INTEGER, DATE, STRING, TEXT } = Sequelize;
    return queryInterface.createTable('record', {
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
      time: {
        type: DATE,
        allowNull: true,
      },
      ctrl: {
        type: TEXT,
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
    return queryInterface.dropTable('record');
  },
};
