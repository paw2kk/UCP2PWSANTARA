const { Op } = require("sequelize");
const { WeatherLocation } = require("../model");
const { getCurrentWeather } = require("../services/weatherService");

const getLocations = async (req, res, next) => {
  try {
    const { search, province, limit = 50 } = req.query;
    const where = {};
    if (province) where.province = province;
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { city: { [Op.iLike]: `%${search}%` } },
      { province: { [Op.iLike]: `%${search}%` } }
    ];
    const data = await WeatherLocation.findAll({
      where, limit: Math.min(Number(limit) || 50, 100), order: [["id", "ASC"]]
    });
    res.json({ success: true, count: data.length, data });
  } catch (e) { next(e); }
};

const getLocation = async (req, res, next) => {
  try {
    const data = await WeatherLocation.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan." });
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const createLocation = async (req, res, next) => {
  try {
    const data = await WeatherLocation.create(req.body);
    res.status(201).json({ success: true, message: "Lokasi berhasil dibuat.", data });
  } catch (e) { next(e); }
};

const updateLocation = async (req, res, next) => {
  try {
    const data = await WeatherLocation.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan." });
    await data.update(req.body);
    res.json({ success: true, message: "Lokasi berhasil diperbarui.", data });
  } catch (e) { next(e); }
};

const deleteLocation = async (req, res, next) => {
  try {
    const data = await WeatherLocation.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan." });
    await data.destroy();
    res.json({ success: true, message: "Lokasi berhasil dihapus." });
  } catch (e) { next(e); }
};

const getWeather = async (req, res, next) => {
  try {
    const location = await WeatherLocation.findOne({ where: { slug: req.params.slug } });
    if (!location) return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan." });

    const weather = await getCurrentWeather({
      latitude: location.latitude, longitude: location.longitude, timezone: location.timezone
    });

    res.json({
      success: true, source: "Open-Meteo",
      location: {
        id: location.id, slug: location.slug, name: location.name, city: location.city,
        province: location.province, latitude: Number(location.latitude),
        longitude: Number(location.longitude), timezone: location.timezone
      },
      current: weather.current,
      hourly: weather.hourly
    });
  } catch (e) { next(e); }
};

module.exports = { getLocations, getLocation, createLocation, updateLocation, deleteLocation, getWeather };
