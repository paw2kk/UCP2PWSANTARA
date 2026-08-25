const crypto = require("crypto");

const generateApiKey = () => {
  const secret = crypto.randomBytes(32).toString("hex");
  const plain = `iw_live_${secret}`;
  return {
    plain,
    prefix: plain.slice(0, 15),
    hash: crypto.createHash("sha256").update(plain).digest("hex")
  };
};

const hashApiKey = key => crypto.createHash("sha256").update(key).digest("hex");

module.exports = { generateApiKey, hashApiKey };
