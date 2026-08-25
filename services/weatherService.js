const axios = require("axios");

const getCurrentWeather = async ({ latitude, longitude, timezone }) => {
  const response = await axios.get(process.env.OPEN_METEO_BASE_URL, {
    timeout: 15000,
    params: {
      latitude, longitude, timezone,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m",
      hourly: "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
      forecast_days: 3
    }
  });
  return response.data;
};

module.exports = { getCurrentWeather };
