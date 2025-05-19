'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // build an array of 100 000 fake borrowers… (your existing logic here)
    const borrowers = Array.from({ length: 100000 }, () => ({
      firstName: Sequelize.literal(`faker.name.firstName()`),
      lastName:  Sequelize.literal(`faker.name.lastName()`),
      email:     Sequelize.literal(`faker.internet.email()`),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // NOTE: table name must match your CREATE TABLE migration: "Borrowers"
    await queryInterface.bulkInsert('Borrowers', borrowers, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Borrowers', null, {});
  }
};
