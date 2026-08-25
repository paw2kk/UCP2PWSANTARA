const { ApiKey } = require("../model");
const { hashApiKey } = require("../utils/apiKey");

const authenticateApiKey = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const apiKey = header && header.startsWith("Bearer ") ? header.substring(7).trim() : req.headers["x-api-key"];

    if (!apiKey || !apiKey.startsWith("iw_live_")) {
      return res.status(401).json({
        success: false,
        message: "API Key wajib dikirim melalui Authorization Bearer Token atau x-api-key."
      });
    }

    const record = await ApiKey.findOne({ where: { key_hash: hashApiKey(apiKey), is_active: true } });
    if (!record) return res.status(401).json({ success: false, message: "API Key tidak valid atau tidak aktif." });

    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      return res.status(401).json({ success: false, message: "API Key sudah kedaluwarsa." });
    }

    await record.update({ last_used_at: new Date() });
    req.apiKey = record;
    next();
  } catch (e) { next(e); }
};

module.exports = { authenticateApiKey };
