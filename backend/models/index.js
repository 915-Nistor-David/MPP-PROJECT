'use strict';

const fs      = require('fs');
const path    = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

// 1️⃣ Determine environment
const env    = process.env.NODE_ENV || 'development';

// 2️⃣ Load the JS config (we replaced config.json with config.js)
const config = require(__dirname + '/../config/config.js')[env];

const db = {};
let sequelize;

// 3️⃣ Initialise Sequelize: either via DATABASE_URL or via explicit credentials
if (config.use_env_variable) {
  // e.g. in production on Render
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    // ensure we don’t accidentally override the env var URL
    dialect:    config.dialect,
    dialectOptions: config.dialectOptions
  });
} else {
  // local dev / test (MySQL)
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// 4️⃣ Auto-import all .js model files in this directory
fs
  .readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js'
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 5️⃣ Run any associations (if defined)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 6️⃣ Export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
