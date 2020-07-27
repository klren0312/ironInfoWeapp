'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('user', [{
      username: 'admin',
      password: '$2a$10$SU703/GoS8wBkIvYRq6uce5uAtSLRel1OclbaXbNRXjw.m20Tboqy',
      email: 'demo@demo.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 1,
      role: 'superAdmin',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('user', null, {});
  },
};
