// backend/models/borrower.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Borrower extends Model {
    static associate(models) {
      Borrower.hasMany(models.Loan, {
        foreignKey: 'borrowerId',
        as: 'loans',
        onDelete: 'CASCADE'
      });
    }
  }
  Borrower.init({
    firstName: DataTypes.STRING,
    lastName:  DataTypes.STRING,
    email:     DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Borrower',
    tableName: 'Borrowers',
    indexes: [
      { fields: ['email'] },
      { fields: ['lastName'] }
    ]
  });
  return Borrower;
};
