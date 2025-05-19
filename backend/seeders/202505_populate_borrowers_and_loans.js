'use strict';
const { faker } = require('@faker-js/faker');

const BORROWER_COUNT = 5000;
const LOAN_COUNT     = 8000;
const CHUNK          = 1000;   // rows per insert

module.exports = {
  async up (qi) {
    /* ---------- skip if already seeded ---------- */
    const [found] = await qi.sequelize.query('SELECT 1 FROM "Borrowers" LIMIT 1');
    if (found.length) return;

    /* ---------- borrowers ---------- */
    const borrowers = Array.from({ length: BORROWER_COUNT }, () => ({
      firstName: faker.person.firstName(),
      lastName:  faker.person.lastName(),
      email:     faker.internet.email(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    for (let i = 0; i < borrowers.length; i += CHUNK) {
      await qi.bulkInsert('Borrowers', borrowers.slice(i, i + CHUNK));
    }

    /* ---------- loans ---------- */
    const loans = [];
    for (let i = 0; i < LOAN_COUNT; i++) {
      loans.push({
        borrowerId:  (i % BORROWER_COUNT) + 1,                    // simple round-robin
        amount:      Math.floor(Math.random() * 9000) + 1000,
        interestRate:parseFloat((Math.random() * 10).toFixed(2)),
        dueDate:     faker.date.soon({ days: 365 }).toISOString().slice(0,10),
        period:      [6,12,24,36][Math.floor(Math.random()*4)],
        lifeInsurance:Math.random() > 0.5,
        createdAt:   new Date(),
        updatedAt:   new Date()
      });
    }

    for (let i = 0; i < loans.length; i += CHUNK) {
      await qi.bulkInsert('Loans', loans.slice(i, i + CHUNK));
    }
  },

  async down (qi) {
    await qi.bulkDelete('Loans',     null);
    await qi.bulkDelete('Borrowers', null);
  }
};
