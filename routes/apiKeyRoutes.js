const express = require("express");
const { authenticateJWT } = require("../middleware/authMiddleware");
const { createApiKey, listApiKeys, revokeApiKey } = require("../controller/apiKeyController");

const router = express.Router();
router.use(authenticateJWT);
router.post("/", createApiKey);
router.get("/", listApiKeys);
router.delete("/:id", revokeApiKey);

module.exports = router;
