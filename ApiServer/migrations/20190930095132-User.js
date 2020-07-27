'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { STRING, BOOLEAN, INTEGER, DATE } = Sequelize;
    return queryInterface.createTable('user', {
      id: {
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      username: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){1,50}$/i,
          isLowercase: true,
        },
      },
      password: {
        type: STRING,
        allowNull: true,
      },
      email: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          isLowercase: true,
        },
      },
      avatar: {
        type: STRING,
        allowNull: true,
      },
      status: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      role: {
        type: STRING,
        allowNull: false,
        defaultValue: 'anonymous',
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
    return queryInterface.dropTable('user');
  },
};
