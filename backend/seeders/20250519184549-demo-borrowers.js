'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    // generate 10 demo borrowers
    const borrowers = Array.from({ length: 10 }).map(() => ({
      firstName: faker.name.firstName(),
      lastName:  faker.name.lastName(),
      email:     faker.internet.email().toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Borrowers', borrowers, {});
  },

  async down (queryInterface, Sequelize) {
    // this removes *all* emails matching our demo faker pattern
    await queryInterface.bulkDelete(
      'Borrowers',
      { email: { [Sequelize.Op.like]: '%@%.' } },
      {}
    );
  }
};
