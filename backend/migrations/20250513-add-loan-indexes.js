'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addIndex('Loans', ['borrowerId'], {
      name: 'idx_loans_borrowerId'
    });

   
    await queryInterface.addIndex('Loans', ['amount'], {
      name: 'idx_loans_amount'
    });
    await queryInterface.addIndex('Loans', ['interestRate'], {
      name: 'idx_loans_interestRate'
    });
    await queryInterface.addIndex('Loans', ['dueDate'], {
      name: 'idx_loans_dueDate'
    });
    await queryInterface.addIndex('Loans', ['period'], {
      name: 'idx_loans_period'
    });
    await queryInterface.addIndex('Loans', ['lifeInsurance'], {
      name: 'idx_loans_lifeInsurance'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Loans', 'idx_loans_borrowerId');
    await queryInterface.removeIndex('Loans', 'idx_loans_amount');
    await queryInterface.removeIndex('Loans', 'idx_loans_interestRate');
    await queryInterface.removeIndex('Loans', 'idx_loans_dueDate');
    await queryInterface.removeIndex('Loans', 'idx_loans_period');
    await queryInterface.removeIndex('Loans', 'idx_loans_lifeInsurance');
  }
};
