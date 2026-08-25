const express = require("express");
const {
  getLocations, getLocation, createLocation, updateLocation, deleteLocation, getWeather
} = require("../controller/weatherController");
const { authenticateApiKey } = require("../middleware/apiKeyMiddleware");

const router = express.Router();

router.get("/locations", authenticateApiKey, getLocations);
router.get("/locations/:id", authenticateApiKey, getLocation);
router.post("/locations", authenticateApiKey, createLocation);
router.put("/locations/:id", authenticateApiKey, updateLocation);
router.delete("/locations/:id", authenticateApiKey, deleteLocation);
router.get("/weather/:slug", authenticateApiKey, getWeather);

module.exports = router;
