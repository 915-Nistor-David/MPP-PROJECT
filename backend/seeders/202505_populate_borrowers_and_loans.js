'use strict';

const faker = require('@faker-js/faker').faker;

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1) first seed some borrowers (if you need more or want to reuse the other file, skip this)
    // const borrowers = …
    // await queryInterface.bulkInsert('Borrowers', borrowers, {});
    //
    // 2) then seed loans
    const loans = [];
    for (let i = 0; i < 100000; i++) {
      // pick a random borrower id between 1 and however many you inserted
      const borrowerId = Math.floor(Math.random() * 100000) + 1;
      loans.push({
        borrowerId,
        amount:        Math.floor(Math.random() * 9000) + 1000,
        interestRate:  parseFloat((Math.random() * 10).toFixed(2)),
        dueDate:       new Date().toISOString().slice(0,10),
        period:        [6,12,24,36][Math.floor(Math.random()*4)],
        lifeInsurance: Math.random() > 0.5,
        createdAt:     new Date(),
        updatedAt:     new Date()
      });
    }

    // Again, table name must be exactly "Loans"
    await queryInterface.bulkInsert('Loans', loans, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Loans', null, {});
  }
};
