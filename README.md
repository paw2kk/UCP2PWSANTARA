# IndoWeather API SaaS

JWT-only REST API. Tidak menggunakan API Key dan tidak menggunakan frontend.

## Alur
Register -> Login -> JWT -> Postman Authorization Bearer Token -> GET/POST/PUT/DELETE.

## Jalankan
npm install
npm run seed
npm start

Server: http://localhost:3000

## Demo
demo@indoweather.local / 123
admin@indoweather.local / paw

## Endpoint
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
GET /api/v1/locations
GET /api/v1/locations/:id
POST /api/v1/locations
PUT /api/v1/locations/:id
DELETE /api/v1/locations/:id
GET /api/v1/weather/:slug

Semua endpoint layanan memerlukan JWT melalui Postman Authorization -> Bearer Token.

Seed menyediakan 53 lokasi Indonesia.
