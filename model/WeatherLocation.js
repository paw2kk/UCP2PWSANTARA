const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const WeatherLocation = sequelize.define("WeatherLocation", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  city: { type: DataTypes.STRING(150), allowNull: false },
  province: { type: DataTypes.STRING(150), allowNull: false },
  country: { type: DataTypes.STRING(80), defaultValue: "Indonesia" },
  latitude: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
  elevation_m: { type: DataTypes.INTEGER, defaultValue: 0 },
  timezone: { type: DataTypes.STRING(80), defaultValue: "Asia/Jakarta" },
  population: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: "weather_locations", timestamps: true, underscored: true });

module.exports = WeatherLocation;
