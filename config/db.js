const { Sequelize } = require("sequelize");
const pg = require("pg");
require("dotenv").config();

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  dialectModule: pg,
  logging: false,

  dialectOptions:
    process.env.NODE_ENV === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

const connectDB = async () => {
  await sequelize.authenticate();
  console.log("PostgreSQL berhasil terhubung.");
};

module.exports = {
  sequelize,
  connectDB,
};