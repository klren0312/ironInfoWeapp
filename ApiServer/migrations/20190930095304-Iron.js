'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { STRING, TEXT, FLOAT, INTEGER, DATE } = Sequelize;

    return queryInterface.createTable('iron', {
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
    return queryInterface.dropTable('iron');
  },
};
