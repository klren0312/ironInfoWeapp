'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { STRING, TEXT, BOOLEAN, INTEGER, DATE } = Sequelize;
    return queryInterface.createTable('article', {
      id: {
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      title: {
        type: STRING,
        allowNull: false,
      },
      content: {
        type: TEXT,
        allowNull: true,
      },
      content: {
        type: TEXT,
        allowNull: true,
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
    return queryInterface.dropTable('article');
  },
};
