'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const process   = require('process');
const basename  = path.basename(__filename);
const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config/config.json')[env];
const db        = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// 1) Dynamically import all model files
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const modelDef = require(path.join(__dirname, file));
    const model    = modelDef(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 2) If any model implements an `associate` method, call it
Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

// 3) Explicitly define Borrower ↔ Loan associations
//    (in case you haven't added `associate` in each model file)
if (db.Borrower && db.Loan) {
  db.Borrower.hasMany(db.Loan, {
    foreignKey: 'borrowerId',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
  db.Loan.belongsTo(db.Borrower, {
    foreignKey: 'borrowerId',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
