const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define("User", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(180), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false }
}, { tableName: "users", timestamps: true, underscored: true });

module.exports = User;
