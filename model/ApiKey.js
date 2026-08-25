const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ApiKey = sequelize.define("ApiKey", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  key_prefix: { type: DataTypes.STRING(20), allowNull: false },
  key_hash: { type: DataTypes.STRING(64), allowNull: false, unique: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  last_used_at: { type: DataTypes.DATE, allowNull: true },
  expires_at: { type: DataTypes.DATE, allowNull: true }
}, { tableName: "api_keys", timestamps: true, underscored: true });

module.exports = ApiKey;
