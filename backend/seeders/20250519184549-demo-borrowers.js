// backend/seeders/20250519184549-demo-borrowers.js
'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface) {
    const rows = [];

    // ⚠️ 100 000 rows can take a LONG time on free Render; start with 5 000–10 000
    for (let i = 0; i < 5000; i++) {
      rows.push({
        firstName: faker.person.firstName(),   // plain strings, not SQL
        lastName:  faker.person.lastName(),
        email:     faker.internet.email(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // table name must match the migration: "Borrowers"
    await queryInterface.bulkInsert('Borrowers', rows);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Borrowers', null);
  }
};
