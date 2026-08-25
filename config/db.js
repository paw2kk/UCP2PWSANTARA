const { Sequelize } = require("sequelize");
const pg = require("pg");
require("dotenv").config();

// Beberapa provider Postgres (Neon/Supabase via integrasi Vercel) menyisipkan
// "?sslmode=require" di connection string. Kalau dibiarkan, pg mem-parsing
// sslmode itu sendiri dan bisa menimpa pengaturan `dialectOptions.ssl` di bawah,
// sehingga rejectUnauthorized:false tidak benar-benar dipakai dan muncul error
// "self-signed certificate in certificate chain". Solusinya: bersihkan sslmode
// dari URL, biarkan dialectOptions.ssl yang mengontrol sepenuhnya.
const rawUrl = process.env.POSTGRES_URL || "";
const connectionUrl = rawUrl
  .replace(/([?&])sslmode=[^&]*&?/i, "$1")
  .replace(/[?&]$/, "");

const useSSL = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(connectionUrl, {
  dialect: "postgres",
  dialectModule: pg,
  logging: false,

  dialectOptions: useSSL
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