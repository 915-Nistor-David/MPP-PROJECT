require('dotenv').config();

module.exports = {
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Render PostgreSQL
      },
    },
  },
  development: {
    username: "root",
    password: "",
    database: "database_development",
    host: "127.0.0.1",
    port: 3307,
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: "",
    database: "database_test",
    host: "127.0.0.1",
    port: 3307,
    dialect: "mysql"
  }
};
