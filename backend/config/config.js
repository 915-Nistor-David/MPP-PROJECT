// config/config.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT     || 5432,
    dialect:  'postgres',
  },

  test: {
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASS_TEST,
    database: process.env.DB_NAME_TEST,
    host:     process.env.DB_HOST_TEST,
    port:     process.env.DB_PORT_TEST || 5432,
    dialect:  'postgres',
  },

  production: {
    use_env_variable: 'DATABASE_URL',
    dialect:          'postgres',
    dialectOptions: {
      ssl: {
        require:            true,
        rejectUnauthorized: false
      }
    }
  }
};
