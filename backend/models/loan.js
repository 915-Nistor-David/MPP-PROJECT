// backend/models/loan.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    static associate(models) {
      Loan.belongsTo(models.Borrower, {
        foreignKey: 'borrowerId',
        as: 'borrower'
      });
    }
  }
  Loan.init({
    borrowerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Borrowers', key: 'id' },
      onDelete: 'CASCADE'
    },
    amount:       { type: DataTypes.FLOAT, allowNull: false },
    interestRate: { type: DataTypes.FLOAT, allowNull: false },
    dueDate:      { type: DataTypes.DATEONLY, allowNull: false },
    period:       { type: DataTypes.INTEGER, allowNull: false },
    lifeInsurance:{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {
    sequelize,
    modelName: 'Loan',
    tableName: 'Loans',
    indexes: [
      { fields: ['borrowerId'] },
      { fields: ['amount'] },
      { fields: ['interestRate'] }
    ]
  });
  return Loan;
};
