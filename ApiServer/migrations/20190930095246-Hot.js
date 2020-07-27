'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { STRING, INTEGER, DATE } = Sequelize;
    return queryInterface.createTable('hot', {
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
    return queryInterface.dropTable('hot');
  },
};
