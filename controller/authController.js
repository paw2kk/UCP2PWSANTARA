const bcrypt = require("bcryptjs");
const { User } = require("../model");
const { generateToken } = require("../utils/jwt");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "name, email, dan password wajib diisi." });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password minimal 6 karakter." });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ success: false, message: "Email sudah terdaftar." });

    const user = await User.create({
      name, email, password: await bcrypt.hash(password, 10)
    });

    res.status(201).json({
      success: true, message: "Registrasi berhasil.",
      data: { id: user.id, name: user.name, email: user.email }
    });
  } catch (e) { next(e); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password || "", user.password)))
      return res.status(401).json({ success: false, message: "Email atau password salah." });

    const token = generateToken({ id: user.id, name: user.name, email: user.email });
    res.json({ success: true, message: "Login berhasil.", data: { token } });
  } catch (e) { next(e); }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ["id", "name", "email", "created_at"] });
    res.json({ success: true, data: user });
  } catch (e) { next(e); }
};

module.exports = { register, login, me };
