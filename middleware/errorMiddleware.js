const notFound = (req, res) => res.status(404).json({ success: false, message: "Endpoint tidak ditemukan." });
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || "Internal server error." });
};
module.exports = { notFound, errorHandler };
