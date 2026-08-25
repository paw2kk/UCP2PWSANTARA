require("dotenv").config();
module.exports = {
  development: { url: process.env.POSTGRES_URL, dialect: "postgres", logging: false },
  production: {
    url: process.env.POSTGRES_URL,
    dialect: "postgres",
    logging: false,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  }
};
