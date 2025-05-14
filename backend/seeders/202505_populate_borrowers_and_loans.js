'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    /* ‑‑‑ PARAMETERS ‑‑‑ */
    const TOTAL_BORROWERS = 100_000;   // change as you like
    const TOTAL_LOANS     = 300_000;   // 3× borrowers
    const BATCH_BORR      = 5_000;
    const BATCH_LOAN      = 10_000;
    const now             = new Date();

    /* ---------- 1. INSERT BORROWERS IN BATCHES ---------- */
    for (let written = 0; written < TOTAL_BORROWERS; written += BATCH_BORR) {
      const bulk = [];
      for (let i = 0; i < BATCH_BORR; i++) {
        bulk.push({
          firstName : faker.person.firstName(),
          lastName  : faker.person.lastName(),
          email     : faker.internet.email(),
          createdAt : now,
          updatedAt : now
        });
      }
      await queryInterface.bulkInsert('Borrowers', bulk);
      console.log(`[seed] borrowers ${written + BATCH_BORR}/${TOTAL_BORROWERS}`);
    }

    /* ---------- 2. READ ALL BORROWER IDS ---------- */
    const rows = await queryInterface.sequelize.query(
      'SELECT id FROM Borrowers',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const borrowerIds = rows.map(r => r.id);

    /* ---------- 3. INSERT LOANS IN BATCHES ---------- */
    for (let written = 0; written < TOTAL_LOANS; written += BATCH_LOAN) {
      const bulk = [];
      for (let i = 0; i < BATCH_LOAN; i++) {
        bulk.push({
          borrowerId   : faker.helpers.arrayElement(borrowerIds),
          amount       : faker.number.int({ min: 100, max: 10_000 }),
          interestRate : faker.number.float({ min: 1, max: 10, precision: 0.01 }),
          dueDate      : faker.date.future({ years: 3 }),
          period       : faker.helpers.arrayElement([6, 12, 24, 36]),
          lifeInsurance: faker.datatype.boolean(),
          createdAt    : now,
          updatedAt    : now
        });
      }
      await queryInterface.bulkInsert('Loans', bulk);
      console.log(`[seed] loans ${written + BATCH_LOAN}/${TOTAL_LOANS}`);
    }
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Loans',     null, {});
    await queryInterface.bulkDelete('Borrowers', null, {});
  }
};
