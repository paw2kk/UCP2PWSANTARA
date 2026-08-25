const express = require("express");

const app = express();

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Vercel Function berhasil berjalan",
    pg_test: (() => {
      try {
        const pg = require("pg");
        return {
          loaded: true,
          version: pg.version || "unknown"
        };
      } catch (error) {
        return {
          loaded: false,
          error: error.message
        };
      }
    })()
  });
});

module.exports = app;