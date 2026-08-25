const { verifyToken } = require("../utils/jwt");

const authenticateJWT = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu." });
  }
  try {
    req.user = verifyToken(header.substring(7));
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token JWT tidak valid atau sudah kedaluwarsa." });
  }
};

module.exports = { authenticateJWT };
