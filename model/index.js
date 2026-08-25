const User = require("./User");
const WeatherLocation = require("./WeatherLocation");
const ApiKey = require("./ApiKey");

User.hasMany(ApiKey, { foreignKey: "user_id", as: "apiKeys", onDelete: "CASCADE" });
ApiKey.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = { User, WeatherLocation, ApiKey };
