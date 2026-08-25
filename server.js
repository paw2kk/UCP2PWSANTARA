require("dotenv").config();
const express = require("express");
const { sequelize, connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const apiKeyRoutes = require("./routes/apiKeyRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => res.json({
  success: true,
  service: "IndoWeather API SaaS",
  status: "ok",
  port: Number(process.env.PORT || 3000),
  timestamp: new Date().toISOString()
}));

app.get("/api/docs", (req, res) => res.json({
  success: true,
  authentication: {
    account: "JWT Bearer Token",
    consumer: "API Key: iw_live_..."
  },
  endpoints: [
    "POST /api/auth/register",
    "POST /api/auth/login",
    "GET /api/auth/me",
    "POST /api/keys",
    "GET /api/keys",
    "DELETE /api/keys/:id",
    "GET /api/v1/locations",
    "GET /api/v1/locations/:id",
    "POST /api/v1/locations",
    "PUT /api/v1/locations/:id",
    "DELETE /api/v1/locations/:id",
    "GET /api/v1/weather/:slug"
  ]
}));

app.use("/api/auth", authRoutes);
app.use("/api/keys", apiKeyRoutes);
app.use("/api/v1", weatherRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
if (require.main === module) {
  connectDB()
    .then(() => sequelize.sync())
    .then(() => app.listen(PORT, () => console.log(`IndoWeather API running on http://localhost:${PORT}`)))
    .catch(e => { console.error("Server gagal:", e.message); process.exit(1); });
}
module.exports = app;
