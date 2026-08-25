require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");
const { User, WeatherLocation } = require("../model");

const locations = [
  {slug:"jakarta",name:"Jakarta",city:"Jakarta",province:"DKI Jakarta",country:"Indonesia",latitude:-6.2088,longitude:106.8456,elevation_m:8,timezone:"Asia/Jakarta",population:10600000},
  {slug:"surabaya",name:"Surabaya",city:"Surabaya",province:"Jawa Timur",country:"Indonesia",latitude:-7.2575,longitude:112.7521,elevation_m:5,timezone:"Asia/Jakarta",population:2874000},
  {slug:"bandung",name:"Bandung",city:"Bandung",province:"Jawa Barat",country:"Indonesia",latitude:-6.9175,longitude:107.6191,elevation_m:768,timezone:"Asia/Jakarta",population:2490000},
  {slug:"medan",name:"Medan",city:"Medan",province:"Sumatera Utara",country:"Indonesia",latitude:3.5952,longitude:98.6722,elevation_m:25,timezone:"Asia/Jakarta",population:2435000},
  {slug:"semarang",name:"Semarang",city:"Semarang",province:"Jawa Tengah",country:"Indonesia",latitude:-6.9667,longitude:110.4167,elevation_m:4,timezone:"Asia/Jakarta",population:1653000},
  {slug:"makassar",name:"Makassar",city:"Makassar",province:"Sulawesi Selatan",country:"Indonesia",latitude:-5.1477,longitude:119.4327,elevation_m:5,timezone:"Asia/Makassar",population:1430000},
  {slug:"palembang",name:"Palembang",city:"Palembang",province:"Sumatera Selatan",country:"Indonesia",latitude:-2.9761,longitude:104.7754,elevation_m:8,timezone:"Asia/Jakarta",population:1718000},
  {slug:"tangerang",name:"Tangerang",city:"Tangerang",province:"Banten",country:"Indonesia",latitude:-6.1783,longitude:106.6319,elevation_m:18,timezone:"Asia/Jakarta",population:1843000},
  {slug:"depok",name:"Depok",city:"Depok",province:"Jawa Barat",country:"Indonesia",latitude:-6.4025,longitude:106.7942,elevation_m:50,timezone:"Asia/Jakarta",population:2100000},
  {slug:"bekasi",name:"Bekasi",city:"Bekasi",province:"Jawa Barat",country:"Indonesia",latitude:-6.2383,longitude:106.9756,elevation_m:16,timezone:"Asia/Jakarta",population:2450000},
  {slug:"yogyakarta",name:"Yogyakarta",city:"Yogyakarta",province:"DI Yogyakarta",country:"Indonesia",latitude:-7.7956,longitude:110.3695,elevation_m:113,timezone:"Asia/Jakarta",population:414000},
  {slug:"malang",name:"Malang",city:"Malang",province:"Jawa Timur",country:"Indonesia",latitude:-7.9666,longitude:112.6326,elevation_m:476,timezone:"Asia/Jakarta",population:847000},
  {slug:"denpasar",name:"Denpasar",city:"Denpasar",province:"Bali",country:"Indonesia",latitude:-8.65,longitude:115.2167,elevation_m:4,timezone:"Asia/Makassar",population:725000},
  {slug:"banjarmasin",name:"Banjarmasin",city:"Banjarmasin",province:"Kalimantan Selatan",country:"Indonesia",latitude:-3.3194,longitude:114.5908,elevation_m:16,timezone:"Asia/Makassar",population:675000},
  {slug:"samarinda",name:"Samarinda",city:"Samarinda",province:"Kalimantan Timur",country:"Indonesia",latitude:-0.5022,longitude:117.1536,elevation_m:9,timezone:"Asia/Makassar",population:850000},
  {slug:"balikpapan",name:"Balikpapan",city:"Balikpapan",province:"Kalimantan Timur",country:"Indonesia",latitude:-1.2379,longitude:116.8529,elevation_m:4,timezone:"Asia/Makassar",population:750000},
  {slug:"padang",name:"Padang",city:"Padang",province:"Sumatera Barat",country:"Indonesia",latitude:-0.9471,longitude:100.4172,elevation_m:5,timezone:"Asia/Jakarta",population:900000},
  {slug:"pekanbaru",name:"Pekanbaru",city:"Pekanbaru",province:"Riau",country:"Indonesia",latitude:0.5071,longitude:101.4478,elevation_m:12,timezone:"Asia/Jakarta",population:983000},
  {slug:"bandar-lampung",name:"Bandar Lampung",city:"Bandar Lampung",province:"Lampung",country:"Indonesia",latitude:-5.3971,longitude:105.2668,elevation_m:40,timezone:"Asia/Jakarta",population:1210000},
  {slug:"bogor",name:"Bogor",city:"Bogor",province:"Jawa Barat",country:"Indonesia",latitude:-6.595,longitude:106.8167,elevation_m:265,timezone:"Asia/Jakarta",population:1043000},
  {slug:"surakarta",name:"Surakarta",city:"Surakarta",province:"Jawa Tengah",country:"Indonesia",latitude:-7.5755,longitude:110.8243,elevation_m:95,timezone:"Asia/Jakarta",population:523000},
  {slug:"pontianak",name:"Pontianak",city:"Pontianak",province:"Kalimantan Barat",country:"Indonesia",latitude:-0.0263,longitude:109.3425,elevation_m:3,timezone:"Asia/Makassar",population:670000},
  {slug:"manado",name:"Manado",city:"Manado",province:"Sulawesi Utara",country:"Indonesia",latitude:1.4748,longitude:124.8421,elevation_m:5,timezone:"Asia/Makassar",population:460000},
  {slug:"jayapura",name:"Jayapura",city:"Jayapura",province:"Papua",country:"Indonesia",latitude:-2.5916,longitude:140.669,elevation_m:10,timezone:"Asia/Jayapura",population:360000},
  {slug:"ambon",name:"Ambon",city:"Ambon",province:"Maluku",country:"Indonesia",latitude:-3.6954,longitude:128.1814,elevation_m:12,timezone:"Asia/Jayapura",population:350000},
  {slug:"mataram",name:"Mataram",city:"Mataram",province:"Nusa Tenggara Barat",country:"Indonesia",latitude:-8.5833,longitude:116.1167,elevation_m:27,timezone:"Asia/Makassar",population:430000},
  {slug:"kupang",name:"Kupang",city:"Kupang",province:"Nusa Tenggara Timur",country:"Indonesia",latitude:-10.1772,longitude:123.607,elevation_m:55,timezone:"Asia/Makassar",population:440000},
  {slug:"banda-aceh",name:"Banda Aceh",city:"Banda Aceh",province:"Aceh",country:"Indonesia",latitude:5.5483,longitude:95.3238,elevation_m:9,timezone:"Asia/Jakarta",population:260000},
  {slug:"lhokseumawe",name:"Lhokseumawe",city:"Lhokseumawe",province:"Aceh",country:"Indonesia",latitude:5.1801,longitude:97.1507,elevation_m:8,timezone:"Asia/Jakarta",population:190000},
  {slug:"jambi",name:"Jambi",city:"Jambi",province:"Jambi",country:"Indonesia",latitude:-1.6101,longitude:103.6131,elevation_m:23,timezone:"Asia/Jakarta",population:620000},
  {slug:"bengkulu",name:"Bengkulu",city:"Bengkulu",province:"Bengkulu",country:"Indonesia",latitude:-3.7928,longitude:102.2608,elevation_m:17,timezone:"Asia/Jakarta",population:370000},
  {slug:"pangkalpinang",name:"Pangkalpinang",city:"Pangkalpinang",province:"Kepulauan Bangka Belitung",country:"Indonesia",latitude:-2.1316,longitude:106.1169,elevation_m:11,timezone:"Asia/Jakarta",population:220000},
  {slug:"batam",name:"Batam",city:"Batam",province:"Kepulauan Riau",country:"Indonesia",latitude:1.0456,longitude:104.0305,elevation_m:8,timezone:"Asia/Jakarta",population:1200000},
  {slug:"tanjungpinang",name:"Tanjungpinang",city:"Tanjungpinang",province:"Kepulauan Riau",country:"Indonesia",latitude:0.9167,longitude:104.45,elevation_m:3,timezone:"Asia/Jakarta",population:230000},
  {slug:"serang",name:"Serang",city:"Serang",province:"Banten",country:"Indonesia",latitude:-6.1201,longitude:106.1503,elevation_m:25,timezone:"Asia/Jakarta",population:700000},
  {slug:"cilegon",name:"Cilegon",city:"Cilegon",province:"Banten",country:"Indonesia",latitude:-6.0025,longitude:106.0112,elevation_m:30,timezone:"Asia/Jakarta",population:450000},
  {slug:"tasikmalaya",name:"Tasikmalaya",city:"Tasikmalaya",province:"Jawa Barat",country:"Indonesia",latitude:-7.3274,longitude:108.2207,elevation_m:350,timezone:"Asia/Jakarta",population:730000},
  {slug:"cirebon",name:"Cirebon",city:"Cirebon",province:"Jawa Barat",country:"Indonesia",latitude:-6.732,longitude:108.5523,elevation_m:5,timezone:"Asia/Jakarta",population:340000},
  {slug:"tegal",name:"Tegal",city:"Tegal",province:"Jawa Tengah",country:"Indonesia",latitude:-6.8694,longitude:109.1402,elevation_m:4,timezone:"Asia/Jakarta",population:290000},
  {slug:"purwokerto",name:"Purwokerto",city:"Banyumas",province:"Jawa Tengah",country:"Indonesia",latitude:-7.4246,longitude:109.2396,elevation_m:50,timezone:"Asia/Jakarta",population:230000},
  {slug:"magelang",name:"Magelang",city:"Magelang",province:"Jawa Tengah",country:"Indonesia",latitude:-7.4706,longitude:110.2177,elevation_m:375,timezone:"Asia/Jakarta",population:120000},
  {slug:"kediri",name:"Kediri",city:"Kediri",province:"Jawa Timur",country:"Indonesia",latitude:-7.8167,longitude:112.0167,elevation_m:67,timezone:"Asia/Jakarta",population:300000},
  {slug:"madiun",name:"Madiun",city:"Madiun",province:"Jawa Timur",country:"Indonesia",latitude:-7.6298,longitude:111.5239,elevation_m:63,timezone:"Asia/Jakarta",population:200000},
  {slug:"probolinggo",name:"Probolinggo",city:"Probolinggo",province:"Jawa Timur",country:"Indonesia",latitude:-7.7543,longitude:113.2159,elevation_m:10,timezone:"Asia/Jakarta",population:240000},
  {slug:"batu",name:"Batu",city:"Batu",province:"Jawa Timur",country:"Indonesia",latitude:-7.87,longitude:112.5267,elevation_m:850,timezone:"Asia/Jakarta",population:200000},
  {slug:"singkawang",name:"Singkawang",city:"Singkawang",province:"Kalimantan Barat",country:"Indonesia",latitude:0.9088,longitude:108.9846,elevation_m:5,timezone:"Asia/Makassar",population:250000},
  {slug:"palangkaraya",name:"Palangkaraya",city:"Palangkaraya",province:"Kalimantan Tengah",country:"Indonesia",latitude:-2.2161,longitude:113.9135,elevation_m:18,timezone:"Asia/Makassar",population:290000},
  {slug:"tarakan",name:"Tarakan",city:"Tarakan",province:"Kalimantan Utara",country:"Indonesia",latitude:3.3,longitude:117.6333,elevation_m:10,timezone:"Asia/Makassar",population:250000},
  {slug:"gorontalo",name:"Gorontalo",city:"Gorontalo",province:"Gorontalo",country:"Indonesia",latitude:0.5412,longitude:123.0595,elevation_m:9,timezone:"Asia/Makassar",population:200000},
  {slug:"palu",name:"Palu",city:"Palu",province:"Sulawesi Tengah",country:"Indonesia",latitude:-0.9,longitude:119.8333,elevation_m:5,timezone:"Asia/Makassar",population:380000},
  {slug:"kendari",name:"Kendari",city:"Kendari",province:"Sulawesi Tenggara",country:"Indonesia",latitude:-3.9985,longitude:122.5129,elevation_m:30,timezone:"Asia/Makassar",population:350000},
  {slug:"parepare",name:"Parepare",city:"Parepare",province:"Sulawesi Selatan",country:"Indonesia",latitude:-4.0135,longitude:119.6255,elevation_m:25,timezone:"Asia/Makassar",population:150000},
  {slug:"ternate",name:"Ternate",city:"Ternate",province:"Maluku Utara",country:"Indonesia",latitude:0.7907,longitude:127.3842,elevation_m:20,timezone:"Asia/Jayapura",population:220000}
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    });
    await User.create({
      name: process.env.DEMO_USER_NAME,
      email: process.env.DEMO_USER_EMAIL,
      password: await bcrypt.hash(process.env.DEMO_USER_PASSWORD, 10)
    });
    await WeatherLocation.bulkCreate(locations);
    console.log(`Seed selesai: ${locations.length} lokasi.`);
    console.log("API Key dibuat melalui POST /api/keys setelah login JWT.");
  } catch (e) {
    console.error("Seed gagal:", e.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}
seed();
