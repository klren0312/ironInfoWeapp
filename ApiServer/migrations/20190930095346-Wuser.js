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
    return queryInterface.createTable('wuser', {
      id: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      openId: {
        type: STRING,
        unique: true,
        allowNull: false,
      },
      avatarUrl: {
        type: STRING,
        allowNull: true,
      },
      nickName: {
        type: STRING,
        allowNull: true,
      },
      gender: {
        type: INTEGER,
        allowNull: true,
      },
      language: {
        type: STRING,
        allowNull: true,
      },
      city: {
        type: STRING,
        allowNull: true,
      },
      province: {
        type: STRING,
        allowNull: true,
      },
      country: {
        type: STRING,
        allowNull: true,
      },
      count: {
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
    return queryInterface.dropTable('wuser');
  },
};
