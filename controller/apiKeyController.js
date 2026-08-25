const { ApiKey } = require("../model");
const { generateApiKey } = require("../utils/apiKey");

const createApiKey = async (req, res, next) => {
  try {
    const { name = "Consumer Key", expires_at = null } = req.body;
    const generated = generateApiKey();

    const record = await ApiKey.create({
      user_id: req.user.id,
      name,
      key_prefix: generated.prefix,
      key_hash: generated.hash,
      expires_at
    });

    res.status(201).json({
      success: true,
      message: "API Key berhasil dibuat. Simpan key sekarang karena hanya ditampilkan sekali.",
      data: {
        id: record.id,
        name: record.name,
        api_key: generated.plain,
        key_prefix: record.key_prefix,
        is_active: record.is_active,
        expires_at: record.expires_at
      }
    });
  } catch (e) { next(e); }
};

const listApiKeys = async (req, res, next) => {
  try {
    const keys = await ApiKey.findAll({
      where: { user_id: req.user.id },
      attributes: ["id", "name", "key_prefix", "is_active", "last_used_at", "expires_at", "created_at"],
      order: [["id", "DESC"]]
    });
    res.json({ success: true, data: keys });
  } catch (e) { next(e); }
};

const revokeApiKey = async (req, res, next) => {
  try {
    const key = await ApiKey.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!key) return res.status(404).json({ success: false, message: "API Key tidak ditemukan." });
    await key.update({ is_active: false });
    res.json({ success: true, message: "API Key berhasil dicabut." });
  } catch (e) { next(e); }
};

module.exports = { createApiKey, listApiKeys, revokeApiKey };
